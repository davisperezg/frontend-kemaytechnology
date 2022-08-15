import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useUpdateCustomer } from "../../hooks/customer/useUpdateCustomer";
import { IModal } from "../../interfaces/modal.interface";
import { MyDialogMUI, MyDialogTitleMUI } from "../dialog/DialogV2";
import * as Yup from "yup";
import { OnKeyUp } from "../../lib/types";
import { getCompany, getPerson } from "../../services/api-info";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  document: Yup.string().required("Por favor ingrese el documento"),
  numDocument: Yup.string().required("Por favor ingrese el Nro. de documento"),
  name: Yup.string().required("Por favor ingrese nombres del cliente"),
  lastName: Yup.string().required("Por favor ingrese el apellidos del cliente"),
  cellphone_1: Yup.string()
    .required("Por favor ingrese el celular")
    .min(9, "Minimo debe contener 9 caracteres")
    .max(9, "Maximo debe contener 9 caracteres"),
  cellphone_2: Yup.string()
    .min(9, "Minimo debe contener 9 caracteres")
    .max(9, "Maximo debe contener 9 caracteres"),
  direction: Yup.string()
    .min(3, "Minimo debe contener 3 caracteres")
    .max(250, "Maximo debe contener 55 caracteres"),
  username: Yup.string()
    .required("Por favor ingrese el usuario que tendra el cliente")
    .min(3, "Minimo debe contener 3 caracteres")
    .max(55, "Maximo debe contener 55 caracteres"),
  password: Yup.string()
    .required("Por favor ingrese la contraseña")
    .min(3, "Minimo debe contener 3 caracteres")
    .max(55, "Maximo debe contener 55 caracteres"),
  fecha_nac: Yup.date(),
});

const CustomerEdit = ({ open, handleClose, entity }: IModal) => {
  const { mutateAsync, isLoading } = useUpdateCustomer();
  const [errorLocal, setErrorLocal] = useState<[]>([]);

  const handleCloseLocal = () => {
    handleClose();
    setErrorLocal([]);
  };

  const formatDateToInput = (val: string | Date) => {
    if (typeof val !== "undefined") {
      const dateInput = new Date(val);
      const validMonth =
        dateInput.getUTCMonth() + 1 < 10
          ? "0" + (Number(dateInput.getUTCMonth()) + 1)
          : dateInput.getUTCMonth() + 1;
      const formatDate =
        dateInput.getUTCFullYear() +
        "-" +
        validMonth +
        "-" +
        dateInput.getUTCDate();
      return formatDate;
    } else {
      return "";
    }
  };

  return (
    <MyDialogMUI
      open={open}
      onClose={handleCloseLocal}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="sm"
    >
      <MyDialogTitleMUI id="scroll-dialog-title">
        Nuevo cliente
      </MyDialogTitleMUI>
      <DialogContent dividers>
        <Formik
          initialValues={{
            id: entity.id,
            name: entity.name,
            lastName: entity.lastName,
            document: entity.document,
            numDocument: entity.numDocument,
            cellphone_1: entity.cellphone_1,
            cellphone_2: entity.cellphone_2 || "",
            direction: entity.direction || "",
            username: entity.username,
            password: entity.password,
            fecha_nac: entity.fecha_nac || undefined,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await mutateAsync({
                variables: {
                  customerInput: values,
                },
              });
              handleClose();
            } catch (e: any) {
              const myErrors = JSON.parse(
                JSON.stringify(e)
              ).response.errors.map((a: any) =>
                a.extensions.exception.response.message.map((b: any) => b)
              );
              const [desErrors] = myErrors;
              setErrorLocal(desErrors);
              toast.error(
                desErrors
                  .map((e: any, i: number) => {
                    return `${i + 1}.- ${e}`;
                  })
                  .join("\n")
              );
            }
          }}
        >
          {({
            errors,
            values,
            handleChange,
            handleBlur,
            touched,
            setValues,
          }) => {
            const handleKeyUp = async (e: OnKeyUp) => {
              if (values.document === "DNI") {
                if (
                  values.numDocument.length > 7 &&
                  values.numDocument.length < 9
                ) {
                  try {
                    const dataPerson = await getPerson(
                      values.document,
                      e.target.value
                    );
                    const person = dataPerson.data;
                    if (
                      !person!.nombres &&
                      !person!.apellidoPaterno &&
                      !person!.apellidoMaterno
                    ) {
                      //mostrar error
                      return;
                    } else {
                      setValues({
                        ...values,
                        name: person.nombres,
                        lastName:
                          person.apellidoPaterno + " " + person.apellidoMaterno,
                      });
                    }
                  } catch (e) {
                    alert(e);
                  }
                }
              } else if (values.document === "RUC") {
                if (e.target.value.length > 10 && e.target.value.length < 12) {
                  try {
                    const dataCompany = await getCompany(
                      values.document,
                      e.target.value
                    );
                    const company = dataCompany.data;
                    if (!company!.nombre) {
                      //mostrar error
                      return;
                    } else {
                      const checkRuc = String(company.numeroDocumento).slice(
                        0,
                        2
                      );

                      setValues({
                        ...values,
                        name: company.nombre,
                        lastName:
                          checkRuc === "10"
                            ? "PERSONA NATURAL"
                            : "PERSONA JURIDICA",
                        direction:
                          company.direccion +
                          " " +
                          company.distrito +
                          " - " +
                          company.provincia +
                          " - " +
                          company.departamento,
                      });
                    }
                  } catch (e) {
                    alert(e);
                  }
                }
              }
            };

            return (
              <Form>
                <Grid container spacing={2}>
                  {errorLocal.length > 0 && (
                    <Grid item xs={12}>
                      {errorLocal.map((a: any, i: number) => {
                        return (
                          <div
                            key={i + 1}
                            style={{
                              background: "#D32F2F",
                              color: "#fff",
                              padding: 5,
                              fontSize: 12,
                            }}
                          >
                            {i + 1}.- {a}
                          </div>
                        );
                      })}
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      error={touched.document && errors.document ? true : false}
                    >
                      <InputLabel id="label-document">Documento</InputLabel>
                      <Select
                        labelId="label-document"
                        id="document"
                        name="document"
                        label="Documento"
                        value={values.document}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="DNI">DNI</MenuItem>
                        <MenuItem value="RUC">RUC</MenuItem>
                        <MenuItem value="CARNET DE EXTRANJERIA">
                          CARNET DE EXTRANJERIA
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      id="numDocument"
                      label="Nro de documento"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      onKeyUp={handleKeyUp}
                      value={values.numDocument}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.numDocument && errors.numDocument ? true : false
                      }
                    />

                    {touched.numDocument && errors.numDocument && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="numDocument-error-text"
                      >
                        {errors.numDocument}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={values.document === "RUC" ? 12 : 6}>
                    <TextField
                      size="small"
                      id="name"
                      label={
                        values.document === "RUC" ? "Razon social" : "Nombres"
                      }
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name ? true : false}
                    />

                    {touched.name && errors.name && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="name-error-text"
                      >
                        {errors.name}
                      </FormHelperText>
                    )}
                  </Grid>
                  {values.document === "DNI" && (
                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        id="lastName"
                        label="Apellidos"
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.lastName && errors.lastName ? true : false
                        }
                      />

                      {touched.lastName && errors.lastName && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="lastName-error-text"
                        >
                          {errors.lastName}
                        </FormHelperText>
                      )}
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      id="cellphone_1"
                      label="Celular"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      value={values.cellphone_1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.cellphone_1 && errors.cellphone_1 ? true : false
                      }
                    />

                    {touched.cellphone_1 && errors.cellphone_1 && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="cellphone_1-error-text"
                      >
                        {errors.cellphone_1}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      id="cellphone_2"
                      label="Celular(opcional)"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      value={values.cellphone_2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.cellphone_2 && errors.cellphone_2 ? true : false
                      }
                    />

                    {touched.cellphone_2 && errors.cellphone_2 && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="cellphone_2-error-text"
                      >
                        {errors.cellphone_2}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      id="direction"
                      label="Dirección(opcional)"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      value={values.direction}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.direction && errors.direction ? true : false
                      }
                    />

                    {touched.direction && errors.direction && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="direction-error-text"
                      >
                        {errors.direction}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      id="fecha_nac"
                      label="Fecha de nacimiento(opcional)"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={formatDateToInput(values.fecha_nac as string)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.fecha_nac && errors.fecha_nac ? true : false
                      }
                    />

                    {touched.fecha_nac && errors.fecha_nac && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="fecha_nac-error-text"
                      >
                        {errors.fecha_nac}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      id="username"
                      label="Usuario"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.username && errors.username ? true : false}
                    />

                    {touched.username && errors.username && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="username-error-text"
                      >
                        {errors.username}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      id="password"
                      label="Contraseña"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.password && errors.password ? true : false}
                    />

                    {touched.password && errors.password && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="password-error-text"
                      >
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <DialogActions>
                  <Button onClick={handleCloseLocal}>Cancelar</Button>
                  <Button
                    disabled={isLoading}
                    type="submit"
                    color="primary"
                    variant="contained"
                  >
                    OK
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </MyDialogMUI>
  );
};

export default CustomerEdit;
