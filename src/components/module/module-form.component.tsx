import React, { useState, ChangeEvent, FormEvent } from "react";
import TextField from "@material-ui/core/TextField";
import { Module } from "../../interfaces/module.interface";
import Grid from "@material-ui/core/Grid";
import { useUpdateModule } from "../../hooks/module/useUpdateModule";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FormChange = FormEvent<HTMLFormElement>;

const ModuleForm = ({
  module,
  handleClose,
}: {
  module: Module;
  handleClose: () => void;
}) => {
  const initialValue: Module = {
    id: module.id,
    name: module.name,
    description: module.description,
  };

  const { updateModule } = useUpdateModule();
  const [moduleForm, setModuleForm] = useState<Module>(initialValue);
  const dispatch = useDispatch();

  const handleInput = (e: InputChange) => {
    setModuleForm({ ...moduleForm, [e.target.name]: e.target.value });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const onSubmit = (e: FormChange) => {
    e.preventDefault();
    updateModule({
      variables: {
        moduleInput: moduleForm,
      },
    });
    dispatch(
      setAlert({
        type: "success",
        text: "El modulo se actualizó correctamente.",
      })
    );
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              onChange={handleInput}
              name="name"
              id="idName"
              label="Modulo"
              variant="outlined"
              value={moduleForm.name}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              onChange={handleInput}
              name="description"
              id="idDescription"
              label="Descripción"
              multiline
              value={moduleForm.description}
              variant="outlined"
            />
          </Grid>
          <DialogActions style={{ width: "100%" }}>
            <Button onClick={() => handleClose()} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary" autoFocus variant="contained">
              {moduleForm.id ? "Actualizar" : "Registrar"}
            </Button>
          </DialogActions>
        </Grid>
      </form>
    </>
  );
};

export default ModuleForm;
