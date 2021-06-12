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
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ModulePage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const { data, loading, error } = useGetModules();

  const classes = useStyles();

  useEffect(() => {
    if (data) {
      setModules(data.getModules);
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return (
    <>
      <TableContainer component={Paper}>
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
  );
};

export default ModulePage;
