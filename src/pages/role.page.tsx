import React, { useState, useEffect } from "react";
//tables
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import { Role } from "../interfaces/role.interface";
import { useGetRoles } from "../hooks/role/useGetRoles";
//end tables
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@mui/material/Tooltip";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RoleList from "../components/role/role-list";
import IconButton from "@mui/material/IconButton";
import RoleForm from "../components/role/rol-form";
import { useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { PERMIT_ONE, PERMIT_TWO } from "../const";
import { loadAccess } from "../components/acceso/filter-access.component";
import { useSelector } from "react-redux";
import { User } from "../interfaces/user.interface";
import { findError } from "../helpers/control-errors";

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
  //const classes = useStyles();

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
      <TableContainer style={{ whiteSpace: "nowrap" }} component={Paper}>
        <Table
          //className={classes.table}
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
