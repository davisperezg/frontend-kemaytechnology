import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useGetUsers } from "../hooks/user/useGetUsers";
import { User } from "../interfaces/user.interface";
import UserList from "../components/user/user-list";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import DialogForm from "../components/dialog/dialog.component";
import UserForm from "../components/user/user-form";
import { useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { PERMIT_ONE, PERMIT_TWO } from "../const";
import { loadAccess } from "../components/acceso/filter-access.component";

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

const UserPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [dialog, setDialog] = useState<Dialog>(initialValueButton);
  const { data, loading, error } = useGetUsers();
  const dispatch = useDispatch();

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
        return <UserForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setUsers(data.getUsers);
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }

  const showDialog = () => (
    <>
      <DialogForm
        open={dialog.active}
        title={`${dialog.name} Usuario`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <Tooltip title="Crear Usuario">
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
      <TableContainer component={Paper} style={{ marginTop: 10 }}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <UserList key={user.id} user={user} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default UserPage;
