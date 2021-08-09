import React, { useState, useEffect } from "react";
import { useGetModules } from "../hooks/module/useGetModules";
import { Module } from "../interfaces/module.interface";
//css library materialui
import { makeStyles } from "@material-ui/core/styles";
//tables
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
//end tables
import ItemModule from "../components/table/item-module.component";
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@material-ui/core/Tooltip";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import IconButton from "@material-ui/core/IconButton";
import ModuleForm from "../components/module/module-form.component";
import { useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { useSelector } from "react-redux";
import { User } from "../interfaces/user.interface";
import { ROLSA } from "../const";
import { findError } from "../helpers/control-errors";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface Dialog {
  name: string;
  active: boolean;
}

const initialValueButton = {
  name: "",
  active: false,
};

const ModulePage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const { data, loading, error } = useGetModules();
  const [dialog, setDialog] = useState<Dialog>(initialValueButton);
  const dispatch = useDispatch();
  const classes = useStyles();
  const auth: User = useSelector((state: any) => state.authReducer.authUser);

  const handleClose = () => {
    setDialog({ ...dialog, active: false });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <ModuleForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setModules(data.getModules);
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  return (
    <>
      {auth?.role?.name === ROLSA ? (
        <>
          <DialogForm
            open={dialog.active}
            title={`${dialog.name} Modulo`}
            component={component(dialog.name)}
            handleClose={handleClose}
          />

          <Tooltip title="Crear Rol">
            <IconButton
              aria-label="add"
              size="small"
              onClick={() => setDialog({ name: "Crear", active: true })}
            >
              <AddRoundedIcon />
            </IconButton>
          </Tooltip>
          <TableContainer style={{ whiteSpace: "nowrap" }} component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Modulo</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Fecha creada</TableCell>
                  <TableCell>Fecha modificada</TableCell>
                  <TableCell align="center">Menus</TableCell>
                  <TableCell align="center">Permisos</TableCell>
                  <TableCell align="right">Opciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((module) => (
                  <ItemModule key={module.id} module={module} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <h1>No tiene permiso para acceder a este recurso.</h1>
        </>
      )}
    </>
  );
};

export default ModulePage;
