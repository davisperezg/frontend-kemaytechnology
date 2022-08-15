import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import { useUpdateBilling } from "../../hooks/billing/useUpdateBilling";
import { IModal } from "../../interfaces/modal.interface";
import { MyDialogMUI, MyDialogTitleMUI } from "../dialog/DialogV2";

const BillingEdit = ({ open, handleClose, entity }: IModal) => {
  const { mutateAsync, isLoading } = useUpdateBilling();
  const [errorLocal, setErrorLocal] = useState<[]>([]);

  const handleCloseLocal = () => {
    handleClose();
    setErrorLocal([]);
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
        Plan de facturación - {entity.name}
      </MyDialogTitleMUI>
      <DialogContent dividers>
        <Formik
          initialValues={{
            id: entity.id,
            name: entity.name || "",
            day: entity.day || 0,
            price: entity.price || 0,
          }}
          validate={(valores) => {
            let errores: any = {};

            // Validacion nombre
            if (!valores.name) {
              errores.name = "Por favor ingresa un nombre";
            } else if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.name)) {
              errores.name = "El nombre solo puede contener letras y espacios";
            }

            // Validacion dias
            if (!valores.day) {
              errores.day =
                "Por favor ingresa los días que contara con el plan de facturación";
            } else if (valores.day < 0) {
              errores.day = "Los días de facturación no debe ser negativos";
            }

            // Validacion precio
            if (!valores.price) {
              errores.price =
                "Por favor ingresa el precio que tendra el plan de facturación";
            } else if (valores.price < 0) {
              errores.price = "El precio de facturación no debe ser negativos";
            }

            return errores;
          }}
          onSubmit={async (values, { resetForm }) => {
            try {
              await mutateAsync({
                variables: {
                  billingInput: values,
                },
              });
              handleCloseLocal();
            } catch (e: any) {
              const myErrors = JSON.parse(
                JSON.stringify(e)
              ).response.errors.map((a: any) =>
                a.extensions.exception.response.message.map((b: any) => b)
              );
              setErrorLocal(myErrors);
            }
          }}
        >
          {({ errors, values, handleChange, handleBlur, touched }) => {
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
                    <TextField
                      size="small"
                      id="name"
                      label="Nombre"
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
                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      id="day"
                      label="Dias"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                      type="number"
                      value={values.day}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.day && errors.day ? true : false}
                      inputProps={{
                        step: 1,
                      }}
                    />

                    {touched.day && errors.day && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="day-error-text"
                      >
                        {errors.day}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="price"
                        error={touched.price && errors.price ? true : false}
                      >
                        Precio
                      </InputLabel>
                      <OutlinedInput
                        id="price"
                        size="small"
                        type="number"
                        autoComplete="off"
                        value={values.price}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.price && errors.price ? true : false}
                        inputProps={{
                          step: 0.01,
                        }}
                        startAdornment={
                          <InputAdornment position="start">S/</InputAdornment>
                        }
                        label="Precio"
                      />
                    </FormControl>

                    {touched.price && errors.price && (
                      <FormHelperText
                        sx={{ color: "#D32F2F" }}
                        id="price-error-text"
                      >
                        {errors.price}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label>Precio X día</label>
                      <label>
                        S/{" "}
                        {Number.isNaN(values.price! / values.day!)
                          ? "0.00"
                          : values.price! / values.day!}
                      </label>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <label>Precio X hora</label>
                      <label>
                        S/{" "}
                        {Number.isNaN(values.price! / values.day!)
                          ? "0.00"
                          : values.price! / values.day! / 24}
                      </label>
                    </div>
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

export default BillingEdit;
