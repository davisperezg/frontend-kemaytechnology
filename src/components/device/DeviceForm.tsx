import {
  Button,
  DialogActions,
  Grid,
  TextField,
  DialogContent,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { useCreateDevice } from "../../hooks/device/useCreateDevice";
import { IModal } from "../../interfaces/modal.interface";
import { MyDialogMUI, MyDialogTitleMUI } from "../dialog/DialogV2";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./device.css";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Por favor ingrese el nombre del dispositivo")
    .min(3, "Minimo debe contener 3 caracteres")
    .max(55, "Maximo debe contener 55 caracteres"),
});

const DeviceForm = ({ open, handleClose }: IModal) => {
  const { mutateAsync, isLoading } = useCreateDevice();
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
        Nuevo dispositivo
      </MyDialogTitleMUI>
      <DialogContent dividers>
        <Formik
          initialValues={{
            name: "",
            commands: "",
            commandsclient: "",
            reference: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await mutateAsync({
                variables: {
                  deviceInput: values,
                },
              });
              resetForm();
              handleClose();
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
    </MyDialogMUI>
  );
};

export default DeviceForm;
