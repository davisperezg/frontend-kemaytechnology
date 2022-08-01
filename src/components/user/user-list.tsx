import React, { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setAlert } from "../../store/alert/action";
import DialogForm from "../dialog/dialog.component";
import { User } from "../../interfaces/user.interface";
import UserForm from "./user-form";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import {
  useActivateUser,
  useDesactivateUser,
} from "../../hooks/user/useUpdateAccessToLogin";
import { loadAccess } from "../acceso/filter-access.component";
import { PERMIT_FOUR, PERMIT_TWO, ROLSA } from "../../const";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PasswordForm from "../password/password-form";
import { findError } from "../../helpers/control-errors";

interface Dialog {
  name: string;
  active: boolean;
}

const initialValueButton = {
  name: "",
  active: false,
};

const UserList = ({ user }: { user: User }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialValueButton);
  const dispatch = useDispatch();
  const optionsActivate = useActivateUser();
  const optionsDesactivate = useDesactivateUser();
  const handleClose = () => {
    setDialog({ ...dialog, active: false });
    dispatch(
      setAlert({
        type: "",
        text: "",
      })
    );
  };

  const desactivateUser = async () => {
    try {
      await optionsDesactivate.desactivateUser({
        variables: { id: user.id },
      });
    } catch (e) {
      setDialog({ name: "error", active: true });
      dispatch(
        setAlert({
          type: "error",
          text: findError(e),
        })
      );
      <DialogForm
        open={dialog.active}
        title={dialog.name}
        handleClose={handleClose}
      />;
    }
  };

  const component = (name: string) => {
    switch (name) {
      case "Usuario":
        return <UserForm user={user} handleClose={handleClose} />;

      case "Contraseña":
        return <PasswordForm user={user} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const showOptionsForEdit = () => (
    <>
      <DialogForm
        open={dialog.active}
        dialog={user}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <TableCell align="right">
        {user.role?.name === ROLSA ? (
          ""
        ) : (
          <>
            {user.status === 2 ? (
              <Tooltip
                title="Activar usuario"
                onClick={() =>
                  optionsActivate.activateUser({
                    variables: { id: user.id },
                  })
                }
              >
                <IconButton
                  aria-label="desactivate"
                  size="small"
                  color="secondary"
                >
                  <RemoveRoundedIcon style={{ color: "#F44336" }} />
                </IconButton>
              </Tooltip>
            ) : user.status === 1 ? (
              <Tooltip title="Desactivar usuario" onClick={desactivateUser}>
                <IconButton
                  aria-label="activate"
                  size="small"
                  style={{ color: "#4CAF50" }}
                >
                  <CheckRoundedIcon style={{ color: "#4CAF50" }} />
                </IconButton>
              </Tooltip>
            ) : (
              ""
            )}
          </>
        )}

        <Tooltip
          title="Editar usuario"
          onClick={() => setDialog({ name: "Usuario", active: true })}
        >
          <IconButton aria-label="role" size="small">
            <EditRoundedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title="Cambiar contraseña"
          onClick={() => setDialog({ name: "Contraseña", active: true })}
        >
          <IconButton aria-label="password" size="small">
            <LockRoundedIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );

  const showData = () => (
    <>
      <TableRow>
        {auth?.role?.name === ROLSA ? (
          <>
            <TableCell component="th" scope="row">
              {user.name} {user.lastName}
            </TableCell>
            <TableCell>{user.role?.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{moment(user.createdAt).format("DD/MM/YYYY")}</TableCell>
            <TableCell>{moment(user.updatedAt).format("DD/MM/YYYY")}</TableCell>
            {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
          </>
        ) : (
          <>
            {user.role?.name === ROLSA || (
              <>
                <TableCell component="th" scope="row">
                  {user.name} {user.lastName}
                </TableCell>
                <TableCell>{user.role?.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {moment(user.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {moment(user.updatedAt).format("DD/MM/YYYY")}
                </TableCell>
                {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
              </>
            )}
          </>
        )}
      </TableRow>
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, page, showData)}</>;
};

export default UserList;
