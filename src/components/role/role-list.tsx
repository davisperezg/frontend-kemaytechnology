import React, { useState } from "react";
//tables
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
//button
import Tooltip from "@mui/material/Tooltip";
//icon
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { Role } from "../../interfaces/role.interface";
import { useDispatch } from "react-redux";
//dates
import moment from "moment";
import { setAlert } from "../../store/alert/action";
import RoleModuleItem from "./role-module-item";
import DialogForm from "../dialog/dialog.component";
import RoleForm from "./rol-form";
import ModuleTransferList from "../module/module-transfer-list";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import { PERMIT_FOUR, PERMIT_TWO, ROLSA } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import { useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";

interface Dialog {
  name: string;
  active: boolean;
}

const initialValueButton = {
  name: "",
  active: false,
};

const RoleList = ({ role }: { role: Role }) => {
  const [dialog, setDialog] = useState<Dialog>(initialValueButton);
  const dispatch = useDispatch();
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);

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
      case "Modulo":
        return <ModuleTransferList role={role} handleClose={handleClose} />;

      case "Rol":
        return <RoleForm role={role} handleClose={handleClose} />;

      default:
        break;
    }
  };
  const showOptionsForEdit = () => (
    <>
      <DialogForm
        open={dialog.active}
        dialog={role}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {role.name === ROLSA ? (
        <TableCell align="center">
          <Tooltip
            title="Asignar modulos"
            onClick={() => setDialog({ name: "Modulo", active: true })}
          >
            <IconButton aria-label="modules" size="small">
              <ViewModuleRoundedIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      ) : (
        <TableCell align="right">
          <Tooltip
            title="Asignar modulos"
            onClick={() => setDialog({ name: "Modulo", active: true })}
          >
            <IconButton aria-label="modules" size="small">
              <ViewModuleRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Editar rol"
            onClick={() => setDialog({ name: "Rol", active: true })}
          >
            <IconButton aria-label="role" size="small">
              <EditRoundedIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      )}
    </>
  );

  const showData = () => (
    <>
      <TableRow>
        {auth?.role?.name === ROLSA ? (
          <>
            <TableCell component="th" scope="row">
              {role.name}
            </TableCell>
            <TableCell>{role.description}</TableCell>
            <TableCell>{moment(role.createdAt).format("DD/MM/YYYY")}</TableCell>
            <TableCell>{moment(role.updatedAt).format("DD/MM/YYYY")}</TableCell>
            <TableCell align="center">
              {role.modules &&
                role.modules.map((module) => (
                  <RoleModuleItem key={module.id} module={module} />
                ))}
            </TableCell>
            {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
          </>
        ) : (
          <>
            {role.name === ROLSA || (
              <>
                <TableCell component="th" scope="row">
                  {role.name}
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  {moment(role.createdAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell>
                  {moment(role.updatedAt).format("DD/MM/YYYY")}
                </TableCell>
                <TableCell align="center">
                  {role.modules &&
                    role.modules.map((module) => (
                      <RoleModuleItem key={module.id} module={module} />
                    ))}
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

export default RoleList;
