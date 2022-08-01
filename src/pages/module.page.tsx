import React, { useState, useEffect } from "react";
import { useGetModules } from "../hooks/module/useGetModules";
import { Module } from "../interfaces/module.interface";
//tables
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
//end tables
import ItemModule from "../components/table/item-module.component";
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@mui/material/Tooltip";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import IconButton from "@mui/material/IconButton";
import ModuleForm from "../components/module/module-form.component";
import { useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { useSelector } from "react-redux";
import { User } from "../interfaces/user.interface";
import { ROLSA } from "../const";
import { findError } from "../helpers/control-errors";

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
              //className={classes.table}
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
