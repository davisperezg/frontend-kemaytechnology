import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { Role } from "../../interfaces/role.interface";
import { useUpdateRole } from "../../hooks/role/useUpdateRole";
import { useCreateRole } from "../../hooks/role/useCreateRole";
import Progress from "../progress/progress";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { createStyles, useTheme, Theme } from "@mui/material/styles";
import { Module } from "../../interfaces/module.interface";
import { useGetModules } from "../../hooks/module/useGetModules";
import { MODULE_FORBIDDEN, ROLSA } from "../../const";
import { useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { findError } from "../../helpers/control-errors";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
type FormChange = FormEvent<HTMLFormElement>;
type SelectChange = ChangeEvent<{ value: unknown } | any | HTMLSelectElement>;

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
  //const classes = useStyles();
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
      const listModulesNoModulos = optionsGetModules.data.getModules.filter(
        (menu: any) => menu.name !== MODULE_FORBIDDEN
      );
      setListModules(listModulesNoModulos);
    }
  }, [optionsGetModules.data]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {roleForm.id && roleForm.name === ROLSA ? (
            ""
          ) : (
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
          )}

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
                {/* <Select
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
                </Select> */}
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
