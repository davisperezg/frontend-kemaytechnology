import React, { useState } from "react";
import { Module } from "../../interfaces/module.interface";
import ItemModuleMenu from "./item-module-menu";
import ItemModuleAccess from "./item-module-access";
//tables
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
//button
import Tooltip from "@mui/material/Tooltip";
//icon
import IconButton from "@mui/material/IconButton";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
//dates
import moment from "moment";
import DialogForm from "../dialog/dialog.component";
import ModuleForm from "../module/module-form.component";
import AccesoForm from "../acceso/access-form.component";
import MenuForm from "../menu/menu-form.component";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { MODULE_FORBIDDEN } from "../../const";
import Chip from "@mui/material/Chip";

interface Dialog {
  name: string;
  active: boolean;
}

const initialValueButton = {
  name: "",
  active: false,
};

const ItemModule = ({ module }: { module: Module }) => {
  const [dialog, setDialog] = useState<Dialog>(initialValueButton);
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
      case "Modulo":
        return <ModuleForm module={module} handleClose={handleClose} />;

      case "Acceso":
        return <AccesoForm module={module} handleClose={handleClose} />;

      case "Menu":
        return <MenuForm module={module} handleClose={handleClose} />;

      default:
        break;
    }
  };

  //["error","info","success","warning"]
  return (
    <>
      <DialogForm
        open={dialog.active}
        dialog={module}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <TableRow>
        <TableCell component="th" scope="row">
          {module.name}
        </TableCell>
        <TableCell>{module.description}</TableCell>
        <TableCell>{moment(module.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(module.updatedAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell align="center">
          {module.menus &&
            module.menus.map((menu) => (
              <ItemModuleMenu key={menu.id} menu={menu} />
            ))}
        </TableCell>
        <TableCell align="center">
          {module.name === MODULE_FORBIDDEN ? (
            <Chip
              style={{ margin: "3px" }}
              size="small"
              label="Todos los permisos"
              color="primary"
            />
          ) : (
            module.access &&
            module.access.map((access) => (
              <ItemModuleAccess key={access.id} access={access} />
            ))
          )}
        </TableCell>

        {module.name === MODULE_FORBIDDEN ? (
          <TableCell align="center">
            <Tooltip
              title="Asignar menu"
              onClick={() => setDialog({ name: "Menu", active: true })}
            >
              <IconButton aria-label="menu" size="small">
                <MenuRoundedIcon />
              </IconButton>
            </Tooltip>
          </TableCell>
        ) : (
          <>
            <TableCell align="right">
              <Tooltip
                title="Asignar menu"
                onClick={() => setDialog({ name: "Menu", active: true })}
              >
                <IconButton aria-label="menu" size="small">
                  <MenuRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Asignar acceso"
                onClick={() => setDialog({ name: "Acceso", active: true })}
              >
                <IconButton aria-label="acceso" size="small">
                  <VerifiedUserRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Editar modulo"
                onClick={() => setDialog({ name: "Modulo", active: true })}
              >
                <IconButton aria-label="acceso" size="small">
                  <EditRoundedIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </>
        )}
      </TableRow>
    </>
  );
};

export default ItemModule;
