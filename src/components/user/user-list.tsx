import React, { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import RemoveRoundedIcon from "@material-ui/icons/RemoveRounded";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { setAlert } from "../../store/alert/action";
import DialogForm from "../dialog/dialog.component";
import { User } from "../../interfaces/user.interface";
import UserForm from "./user-form";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import {
  useActivateUser,
  useDesactivateUser,
} from "../../hooks/user/useUpdateAccessToLogin";
import { loadAccess } from "../acceso/filter-access.component";
import { PERMIT_FOUR, PERMIT_TWO } from "../../const";

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

  const component = (name: string) => {
    switch (name) {
      case "Usuario":
        return <UserForm user={user} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const showOptionsForEdit = () => (
    <>
      <TableCell align="right">
        {user.status === 2 ? (
          <Tooltip
            title="Desactivar usuario"
            onClick={() =>
              optionsActivate.activateUser({
                variables: { id: user.id },
              })
            }
          >
            <IconButton aria-label="desactivate" size="small" color="secondary">
              <RemoveRoundedIcon style={{ color: "#F44336" }} />
            </IconButton>
          </Tooltip>
        ) : user.status === 1 ? (
          <Tooltip
            title="Activar usuario"
            onClick={() =>
              optionsDesactivate.desactivateUser({
                variables: { id: user.id },
              })
            }
          >
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

        <Tooltip
          title="Editar usuario"
          onClick={() => setDialog({ name: "Usuario", active: true })}
        >
          <IconButton aria-label="role" size="small">
            <EditRoundedIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );

  const showData = () => (
    <>
      <DialogForm
        open={dialog.active}
        dialog={user}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <TableRow>
        <TableCell component="th" scope="row">
          {user.name} {user.lastName}
        </TableCell>
        <TableCell>{user.role?.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{moment(user.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(user.updatedAt).format("DD/MM/YYYY")}</TableCell>
        {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
      </TableRow>
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, page, showData)}</>;
};

export default UserList;
