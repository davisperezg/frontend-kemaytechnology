import {
  Button,
  DialogActions,
  Grid,
  TextField,
  DialogContent,
  FormHelperText,
} from "@mui/material";
import { useState, useEffect } from "react";
import { IModal } from "../../interfaces/modal.interface";
import { MyDialogMUI, MyDialogTitleMUI } from "../dialog/DialogV2";
import { Formik, Form } from "formik";
import { useUpdateDevice } from "../../hooks/device/useUpdateDevice";
import { useGetOneDevice } from "../../hooks/device/useGetOneDevice";
import { toast } from "react-toastify";
import * as Yup from "yup";

import "./device.css";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Por favor ingrese el nombre del dispositivo")
    .matches(
      /^[A-Za-z0-9áéíóúÑñ\s-]+$/,
      "El nombre puede contener letras, numeros, guiones y espacios"
    )
    .min(3, "Minimo debe contener 3 caracteres")
    .max(55, "Maximo debe contener 55 caracteres"),

  reference: Yup.string()
    .matches(
      /^[A-Za-z0-9áéíóúÑñ\s-]+$/,
      "El nombre puede contener letras, numeros, guiones y espacios"
    )
    .min(3, "Minimo debe contener 3 caracteres")
    .max(55, "Maximo debe contener 55 caracteres"),
});

const DeviceEdit = ({ open, handleClose, entity }: IModal) => {
  const { mutateAsync, isLoading } = useUpdateDevice();
  const [errorLocal, setErrorLocal] = useState<[]>([]);

  const {
    data,
    isLoading: isLoadingGet,
    isError: isErrorGet,
    error: errorGet,
    isFetching: isFetchingGet,
  } = useGetOneDevice(entity.id);

  const handleCloseLocal = () => {
    handleClose();
    setErrorLocal([]);
  };

  useEffect(() => {
    if (isErrorGet) {
      const myError = JSON.parse(JSON.stringify(errorGet)).response.errors.map(
        (a: any) => a.extensions.exception.response.message.map((b: any) => b)
      );
      toast.error(
        myError
          .map((e: any, i: number) => {
            return i + 1 + " " + e;
          })
          .join("\n")
      );
    }
  }, [isErrorGet, errorGet]);

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
      {isLoadingGet ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          Obteniendo datos...
        </div>
      ) : isErrorGet ? (
        "Ha ocurrido un error"
      ) : (
        <>
          <MyDialogTitleMUI id="scroll-dialog-title">
            Dispositivo - {entity.name}{" "}
            {isFetchingGet && "- Refrescando data..."}
          </MyDialogTitleMUI>
          <DialogContent dividers>
            <Formik
              initialValues={{
                id: data.id,
                name: data.name,
                reference: data.reference || "",
                commands: data.commands || "",
                commandsclient: data.commandsclient || "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  await mutateAsync({
                    variables: {
                      deviceInput: values,
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
                  toast.error(
                    myErrors
                      .map((e: any, i: number) => {
                        return i + 1 + ".- " + e;
                      })
                      .join("\n")
                  );
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
                          id="reference"
                          label="Referencia"
                          variant="outlined"
                          fullWidth
                          autoComplete="off"
                          value={values.reference}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.reference && errors.reference ? true : false
                          }
                        />

                        {touched.reference && errors.reference && (
                          <FormHelperText
                            sx={{ color: "#D32F2F" }}
                            id="reference-error-text"
                          >
                            {errors.reference}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label>Comandos</label>

                          <textarea
                            className="textarea"
                            id="commands"
                            value={values.commands}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={10}
                            cols={10}
                          ></textarea>
                        </div>
                      </Grid>
                      <Grid item xs={12}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <label>Comandos(muestra al cliente)</label>

                          <textarea
                            className="textarea"
                            id="commandsclient"
                            value={values.commandsclient}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={5}
                            cols={10}
                          ></textarea>
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
        </>
      )}
    </MyDialogMUI>
  );
};

export default DeviceEdit;
