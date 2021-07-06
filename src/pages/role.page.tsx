import React, { useState, useEffect } from "react";
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
import { Role } from "../interfaces/role.interface";
import { useGetRoles } from "../hooks/role/useGetRoles";
//end tables
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@material-ui/core/Tooltip";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import RoleList from "../components/role/role-list";
import IconButton from "@material-ui/core/IconButton";
import RoleForm from "../components/role/rol-form";
import { useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { PERMIT_ONE, PERMIT_TWO } from "../const";
import { loadAccess } from "../components/acceso/filter-access.component";
import { useSelector } from "react-redux";
import { User } from "../interfaces/user.interface";
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

const RolePage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialValueButton);
  const dispatch = useDispatch();

  const { data, loading, error } = useGetRoles();
  const classes = useStyles();

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
        return <RoleForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setRoles(data.getRoles);
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  const showDialog = () => (
    <>
      <DialogForm
        open={dialog.active}
        title={`${dialog.name} Rol`}
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
    </>
  );

  const showOptionsForEdit = () => (
    <TableCell align="right">Opciones</TableCell>
  );

  return (
    <>
      {loadAccess(PERMIT_ONE, auth, page, showDialog)}
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Rol</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              <TableCell align="center">Modulos</TableCell>
              {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <RoleList key={role.id} role={role} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RolePage;
