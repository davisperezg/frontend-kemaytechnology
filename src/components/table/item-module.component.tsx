import React, { useState } from "react";
import { Module } from "../../interfaces/module.interface";
import ItemModuleMenu from "./item-module-menu";
import ItemModuleAccess from "./item-module-access";
//tables
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
//button
import Tooltip from "@material-ui/core/Tooltip";
//icon
import IconButton from "@material-ui/core/IconButton";
import MenuRoundedIcon from "@material-ui/icons/MenuRounded";
import VerifiedUserRoundedIcon from "@material-ui/icons/VerifiedUserRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
//dates
import moment from "moment";
import DialogForm from "../dialog/dialog.component";
import ModuleForm from "../module/module-form.component";
import AccesoForm from "../acceso/access-form.component";
import MenuForm from "../menu/menu-form.component";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";

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
          {module.access &&
            module.access.map((access) => (
              <ItemModuleAccess key={access.id} access={access} />
            ))}
        </TableCell>
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
      </TableRow>
    </>
  );
};

export default ItemModule;
