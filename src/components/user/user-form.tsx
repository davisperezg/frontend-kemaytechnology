import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { User } from "../../interfaces/user.interface";
import { setAlert } from "../../store/alert/action";
import { useDispatch } from "react-redux";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useUpdateUser } from "../../hooks/user/useUpdateUser";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { useGetRoles } from "../../hooks/role/useGetRoles";
import { Role } from "../../interfaces/role.interface";
import MenuItem from "@material-ui/core/MenuItem";
import { useCreateUser } from "../../hooks/user/useCreateUser";
import Progress from "../progress/progress";
import { ROLSA } from "../../const";
import { useSelector } from "react-redux";
import { findError } from "../../helpers/control-errors";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FormChange = FormEvent<HTMLFormElement>;
type SelectChange = ChangeEvent<{ value: unknown } | any | HTMLSelectElement>;

const UserForm = ({
  user,
  handleClose,
}: {
  user?: User;
  handleClose: () => void;
}) => {
  const initialValueCreate: User = {
    name: "",
    lastName: "",
    role: {
      name: "",
    },
    email: "",
    password: "",
    confirmPassword: "",
  };

  const initialValueUpdate: User = {
    id: user?.id || "",
    name: user?.name || "",
    lastName: user?.lastName || "",
    role: {
      name: user?.role?.name || "",
    },
    email: user?.email || "",
  };

  const [userForm, setUserForm] = useState<User>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );
  const [listRoles, setListRoles] = useState<Role[]>([]);
  const dispatch = useDispatch();
  const optionsUpdateUser = useUpdateUser();
  const { data } = useGetRoles();
  const optionsCreateUser = useCreateUser();
  const auth: User = useSelector((state: any) => state.authReducer.authUser);

  const handleInput = (e: InputChange) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const handleSelect = (e: SelectChange) => {
    setUserForm({
      ...userForm,
      [e.target.name]: { name: e.target.value },
    });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();
    if (userForm.id) {
      try {
        await optionsUpdateUser.updateUser({
          variables: {
            userInput: userForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El usuario se actualizó correctamente.",
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
    } else {
      try {
        await optionsCreateUser.registerUser({
          variables: {
            userInput: userForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El usuario ha sido registrado correctamente.",
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
    }
  };

  useEffect(() => {
    if (data) {
      setListRoles(data.getRoles);
    }
  }, [data]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              onChange={handleInput}
              name="name"
              autoComplete="off"
              id="idNombres"
              label="Nombres"
              variant="outlined"
              value={userForm.name}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              onChange={handleInput}
              name="lastName"
              autoComplete="off"
              id="idApellidos"
              label="Apellidos"
              value={userForm.lastName}
              variant="outlined"
            />
          </Grid>
          {userForm.role?.name === ROLSA || (
            <>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="idRole">Rol</InputLabel>
                  <Select
                    labelId="Rol"
                    id="idRole"
                    value={userForm.role?.name}
                    onChange={handleSelect}
                    label="Rol"
                    name="role"
                  >
                    {listRoles.map((role) =>
                      auth?.role?.name === ROLSA ? (
                        <MenuItem key={role.id} value={role.name}>
                          {role.name}
                        </MenuItem>
                      ) : (
                        role.name !== ROLSA && (
                          <MenuItem key={role.id} value={role.name}>
                            {role.name}
                          </MenuItem>
                        )
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              onChange={handleInput}
              name="email"
              autoComplete="off"
              id="idEmail"
              label="Correo"
              value={userForm.email}
              variant="outlined"
              InputProps={{
                readOnly: userForm.id ? true : false,
              }}
            />
          </Grid>
          {userForm.id ? (
            ""
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  onChange={handleInput}
                  name="password"
                  autoComplete="off"
                  id="idPassword"
                  label="Contraseña"
                  value={userForm.password}
                  variant="outlined"
                  type="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  onChange={handleInput}
                  name="confirmPassword"
                  autoComplete="off"
                  id="idConfirmPassword"
                  label="Repetir contraseña"
                  value={userForm.confirmPassword}
                  variant="outlined"
                  type="password"
                />
              </Grid>
            </>
          )}
          <DialogActions style={{ width: "100%" }}>
            <Button onClick={() => handleClose()} color="primary">
              Cancelar
            </Button>
            {userForm.id ? (
              optionsUpdateUser.loading ? (
                <Progress />
              ) : (
                <Button
                  type="submit"
                  color="primary"
                  autoFocus
                  variant="contained"
                >
                  Actualizar
                </Button>
              )
            ) : optionsCreateUser.loading ? (
              <Progress />
            ) : (
              <Button
                type="submit"
                color="primary"
                autoFocus
                variant="contained"
              >
                Registrar
              </Button>
            )}
          </DialogActions>
        </Grid>
      </form>
    </>
  );
};

export default UserForm;
