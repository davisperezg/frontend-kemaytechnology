import { Vehicle } from "../../interfaces/vehicle.interface";
import { findError } from "../../helpers/control-errors";
import moment from "moment";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import IconButton from "@mui/material/IconButton";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import DialogForm from "../dialog/dialog.component";
import { useState } from "react";
import { setAlert } from "../../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import { useDeleteVehicle } from "../../hooks/vehicle/useDeleteVehicle";
import VehicleForm from "./vehicle-form";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import RenewForm from "../renew/renew-form";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { GenerarGuiaUSua } from "../../helpers/pdf/guia_usuario";
import BackDrop from "../backdrop/backdrop";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const VehicleList = ({ vehicle }: { vehicle: Vehicle }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const optionsVehicle = useDeleteVehicle();
  const [isActive, setActive] = useState<boolean>(false);

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Vehiculo":
        return <VehicleForm vehicle={vehicle} handleClose={handleClose} />;

      case "Renovar":
        return <RenewForm vehicle={vehicle} handleClose={handleClose} />;

      default:
        break;
    }
  };

  // const deleteVehicle = async (id: string | undefined) => {
  //   try {
  //     await optionsVehicle.deleteVehicle({
  //       variables: {
  //         id,
  //       },
  //     });
  //   } catch (e) {
  //     setDialog({ name: "error", active: true });
  //     dispatch(
  //       setAlert({
  //         type: "error",
  //         text: findError(e),
  //       })
  //     );
  //     <DialogForm
  //       open={dialog.active}
  //       title={dialog.name}
  //       handleClose={handleClose}
  //     />;
  //   }
  // };

  const showOptionsForDelete = () => (
    <>
      <Tooltip
        title="Eliminar vehiculo"
        //onClick={() => deleteVehicle(vehicle.id)}
      >
        <IconButton aria-label="vehicle" size="small">
          <HighlightOffRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );
  const showOptionsForEdit = () => (
    <>
      <Tooltip
        title="Editar vehiclo"
        //onClick={() => setDialog({ name: "Vehiculo", active: true })}
      >
        <IconButton aria-label="vehicle" size="small">
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const hoy = new Date().getTime();
  const fechaFin = vehicle.billigEnd
    ? new Date(vehicle.billigEnd).getTime()
    : new Date().getTime();
  const diff = fechaFin - hoy;
  const calcDiff = diff / (1000 * 60 * 60 * 24);

  const showData = () => (
    <>
      {isActive && <BackDrop state={isActive} />}
      <TableRow
        style={{
          background:
            hoy > fechaFin ? "#fc553f" : calcDiff <= 10 ? "#f7e160" : "#5bc959",
        }}
      >
        {/* <TableCell component="th" scope="row">
          {vehicle.customer.name} {vehicle.customer.lastName}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.customer.cellphone_2
            ? vehicle.customer.cellphone_1 + ", " + vehicle.customer.cellphone_2
            : vehicle.customer.cellphone_1}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.device.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.platform}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.billing.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.plate}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.sim}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.nroGPS}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.billigStart).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.billigEnd).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.createdBy?.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.updatedBy?.name}
        </TableCell>
        <TableCell>{moment(vehicle.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(vehicle.updatedAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell align="right">
          {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
          {loadAccess(PERMIT_TREE, auth, page, showOptionsForDelete)}
          <Tooltip
            title="Renovar vehiculo"
            onClick={() => setDialog({ name: "Renovar", active: true })}
          >
            <IconButton aria-label="renew" size="small">
              <AutorenewRoundedIcon />
            </IconButton>
          </Tooltip>
          {/* boton para pdf guia de usuario */}
        {/*<Tooltip
            title="Generar guia de Usuario"
            onClick={() => {
              GenerarGuiaUSua(vehicle);
            }}
          >
            <IconButton aria-label="user" size="small">
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
        </TableCell> */}
      </TableRow>
    </>
  );

  return (
    <>
      <DialogForm
        open={dialog.active}
        dialog={vehicle}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default VehicleList;
