import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { Role } from "../../interfaces/role.interface";
import { useUpdateRole } from "../../hooks/role/useUpdateRole";
import { useCreateRole } from "../../hooks/role/useCreateRole";
import Progress from "../progress/progress";
import FormControl from "@material-ui/core/FormControl";
import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import { Module } from "../../interfaces/module.interface";
import { useGetModules } from "../../hooks/module/useGetModules";
import { MODULE_FORBIDDEN, ROLSA } from "../../const";
import { useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FormChange = FormEvent<HTMLFormElement>;
type SelectChange = ChangeEvent<{ value: unknown } | any | HTMLSelectElement>;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const RoleForm = ({
  role,
  handleClose,
}: {
  role?: Role;
  handleClose: () => void;
}) => {
  const initialValueUpdate: Role = {
    id: role?.id || "",
    name: role?.name || "",
    description: role?.description || "",
  };

  const initialValueCreate: Role = {
    name: "",
    description: "",
  };

  const optionsUpdateRole = useUpdateRole();
  const optionsCreateRole = useCreateRole();
  const optionsGetModules = useGetModules();
  const [roleForm, setRoleForm] = useState<Role>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );
  const [modulesSelected, setModulesSelected] = useState<Module[]>([]);
  const [listModules, setListModules] = useState<Module[]>([]);
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles();
  const auth: User = useSelector((state: any) => state.authReducer.authUser);

  const handleInput = (e: InputChange) => {
    setRoleForm({ ...roleForm, [e.target.name]: e.target.value });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const handleSelect = (e: SelectChange) => {
    setModulesSelected(e.target.value);
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const sentToAddModules = modulesSelected.map((value) => {
    return { name: value };
  });

  function getStyles(name: any, personName: Module[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const findError = (error: any) => {
    for (let index = 0; index < error.graphQLErrors.length; index++) {
      const element =
        error.graphQLErrors[index].extensions.exception.response.message;
      for (let index1 = 0; index1 < element.length; index1++) {
        const element1 = element[index1];
        return element1;
      }
    }
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();
    if (roleForm.id) {
      try {
        await optionsUpdateRole.updateRole({
          variables: {
            roleInput: roleForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El rol se actualizó correctamente.",
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
        await optionsCreateRole.registerRole({
          variables: {
            roleInput: { ...roleForm, modules: sentToAddModules },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El rol se registró correctamente.",
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
    if (optionsGetModules.data) {
      setListModules(optionsGetModules.data.getModules);
    }
  }, [optionsGetModules.data]);

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
              label="Role"
              variant="outlined"
              value={roleForm.name}
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
              value={roleForm.description}
              variant="outlined"
            />
          </Grid>
          {!initialValueUpdate.id && (
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="module-mutiple-chip-label">Modulos</InputLabel>
                <Select
                  labelId="module-mutiple-chip-label"
                  id="module-mutiple-chip"
                  multiple
                  value={modulesSelected}
                  onChange={handleSelect}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {(selected as any[]).map((module) => {
                        return (
                          <Chip
                            key={module}
                            label={module}
                            className={classes.chip}
                          />
                        );
                      })}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {listModules.map((module) =>
                    auth?.role?.name === ROLSA ? (
                      <MenuItem
                        key={module.id}
                        value={module.name}
                        style={getStyles(
                          module.name,
                          roleForm.modules || [],
                          theme
                        )}
                      >
                        {module.name}
                      </MenuItem>
                    ) : (
                      module.name !== MODULE_FORBIDDEN && (
                        <MenuItem
                          key={module.id}
                          value={module.name}
                          style={getStyles(
                            module.name,
                            roleForm.modules || [],
                            theme
                          )}
                        >
                          {module.name}
                        </MenuItem>
                      )
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>
          )}
          <DialogActions style={{ width: "100%" }}>
            <Button onClick={() => handleClose()} color="primary">
              Cancelar
            </Button>
            {roleForm.id ? (
              optionsUpdateRole.loading ? (
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
            ) : optionsCreateRole.loading ? (
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

export default RoleForm;
