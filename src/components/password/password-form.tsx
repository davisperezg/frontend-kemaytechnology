import React, { useState, ChangeEvent, FormEvent } from "react";
import { User } from "../../interfaces/user.interface";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import Progress from "../progress/progress";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useChangePasswordToAdmin } from "../../hooks/password/useChangePassword";
import { AuthUser } from "../../interfaces/auth.interface";
import { findError } from "../../helpers/control-errors";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FormChange = FormEvent<HTMLFormElement>;

const PasswordForm = ({
  user,
  handleClose,
}: {
  user?: User;
  handleClose: () => void;
}) => {
  const initialValue: AuthUser = {
    id: user?.id || "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [userForm, setUserForm] = useState<AuthUser>(initialValue);
  const dispatch = useDispatch();
  const { changePasswordToAdmin, error, loading } = useChangePasswordToAdmin();

  const handleInput = (e: InputChange) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();
    try {
      await changePasswordToAdmin({
        variables: {
          authInput: userForm,
        },
      });
      dispatch(
        setAlert({
          type: "success",
          text: "La contraseña ha sido cambiada correctamente.",
        })
      );
    } catch (e) {
      dispatch(
        setAlert({
          type: "error",
          text: findError(e),
        })
      );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="currentPassword"
            autoComplete="off"
            id="idPassword"
            label="Contraseña Actual"
            variant="outlined"
            value={userForm.currentPassword}
          />
        </Grid> */}

        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="newPassword"
            autoComplete="off"
            id="idNewPassword"
            label="Nueva Contraseña"
            value={userForm.newPassword}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="confirmNewPassword"
            autoComplete="off"
            id="idConfirmNewPassword"
            label="Confirmar nueva contraseña"
            value={userForm.confirmNewPassword}
            variant="outlined"
          />
        </Grid>

        <DialogActions style={{ width: "100%" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          {loading ? (
            <Progress />
          ) : (
            <Button type="submit" color="primary" autoFocus variant="contained">
              Actualizar
            </Button>
          )}
        </DialogActions>
      </Grid>
    </form>
  );
};

export default PasswordForm;
