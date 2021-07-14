import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { Module } from "../../interfaces/module.interface";
import Grid from "@material-ui/core/Grid";
import { useUpdateModule } from "../../hooks/module/useUpdateModule";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { Menu } from "../../interfaces/menu.interface";
import { Access } from "../../interfaces/access.interface";
import FormControl from "@material-ui/core/FormControl";
import Progress from "../progress/progress";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Chip from "@material-ui/core/Chip";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import { useCreateModule } from "../../hooks/module/useCreateModule";
import { useGetAllAccess } from "../../hooks/access/useGetAllAceess";
import { useGetMenus } from "../../hooks/menu/useGetMenus";
import { MENU_FORBIDDEN, MODULE_FORBIDDEN } from "../../const";
import { findError } from "../../helpers/control-errors";

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

const ModuleForm = ({
  module,
  handleClose,
}: {
  module?: Module;
  handleClose: () => void;
}) => {
  const initialValueUpdate: Module = {
    id: module?.id || "",
    name: module?.name || "",
    description: module?.description || "",
  };

  const initialValueCreate: Module = {
    name: "",
    description: "",
  };

  const optionsUpdateModule = useUpdateModule();
  const optionsCreateModule = useCreateModule();
  const optionsGetAccess = useGetAllAccess();
  const optionsGetMenus = useGetMenus();
  const [menuSelected, setMenuSelected] = useState<Menu[]>([]);
  const [accessSelected, setAccessSelected] = useState<Access[]>([]);
  const [listMenus, setListMenus] = useState<Menu[]>([]);
  const [listAccess, setListAccess] = useState<Access[]>([]);
  const [moduleForm, setModuleForm] = useState<Module>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();

  const handleInput = (e: InputChange) => {
    setModuleForm({ ...moduleForm, [e.target.name]: e.target.value });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const handleSelectMenus = (e: SelectChange) => {
    setMenuSelected(e.target.value);
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const handleSelectAccess = (e: SelectChange) => {
    setAccessSelected(e.target.value);
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const sentToAddMenus = menuSelected.map((value) => {
    return { name: value };
  });

  const sentToAddAccess = accessSelected.map((value) => {
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
    if (moduleForm.id) {
      try {
        await optionsUpdateModule.updateModule({
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
        await optionsCreateModule.registerModule({
          variables: {
            moduleInput: {
              ...moduleForm,
              access: sentToAddAccess,
              menus: sentToAddMenus,
            },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El modulo se registró correctamente.",
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
    if (optionsGetMenus.data && optionsGetAccess.data) {
      const listMenusNoModulos = optionsGetMenus.data.getMenus.filter(
        (menu: any) => menu.name !== MENU_FORBIDDEN
      );
      setListMenus(listMenusNoModulos);
      setListAccess(optionsGetAccess.data.getAccess);
    }
  }, [optionsGetMenus.data, optionsGetAccess.data, moduleForm.name]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {moduleForm.id && moduleForm.name === MODULE_FORBIDDEN ? (
            ""
          ) : (
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
          )}

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
          {!initialValueUpdate.id && (
            <>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="menus-mutiple-chip-label">Menus</InputLabel>
                  <Select
                    labelId="menus-mutiple-chip-label"
                    id="menus-mutiple-chip"
                    multiple
                    value={menuSelected}
                    onChange={handleSelectMenus}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {(selected as any[]).map((menu) => {
                          return (
                            <Chip
                              key={menu}
                              label={menu}
                              className={menu.chip}
                            />
                          );
                        })}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {listMenus.map((menu) => (
                      <MenuItem
                        key={menu.id}
                        value={menu.name}
                        style={getStyles(
                          menu.name,
                          moduleForm.menus || [],
                          theme
                        )}
                      >
                        {menu.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="access-mutiple-chip-label">
                    Accesos
                  </InputLabel>
                  <Select
                    labelId="access-mutiple-chip-label"
                    id="access-mutiple-chip"
                    multiple
                    value={accessSelected}
                    onChange={handleSelectAccess}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {(selected as any[]).map((access) => {
                          return (
                            <Chip
                              key={access}
                              label={access}
                              className={access.chip}
                            />
                          );
                        })}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {listAccess.map((access) => (
                      <MenuItem
                        key={access.id}
                        value={access.name}
                        style={getStyles(
                          access.name,
                          moduleForm.access || [],
                          theme
                        )}
                      >
                        {access.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <DialogActions style={{ width: "100%" }}>
            <Button onClick={() => handleClose()} color="primary">
              Cancelar
            </Button>
            {moduleForm.id ? (
              optionsUpdateModule.loading ? (
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
            ) : optionsCreateModule.loading ? (
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

export default ModuleForm;
