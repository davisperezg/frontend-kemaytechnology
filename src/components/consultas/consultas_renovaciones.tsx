import { Vehicle } from "../../interfaces/vehicle.interface";

import moment from "moment";

import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { startOfDay, add } from "date-fns";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import { useDeleteVehicle } from "../../hooks/vehicle/useDeleteVehicle";

import BackDrop from "../backdrop/backdrop";
import { IconButton, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { GenerarComprobante } from "../../helpers/pdf/comprobante";
const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const VehicleConsultRenovaciones = ({
  vehicle,
}: {
  vehicle: Vehicle | any;
}) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const optionsVehicle = useDeleteVehicle();
  const [isActive, setActive] = useState<boolean>(false);
  const dateEnd = startOfDay(new Date(vehicle.billigEnd || ""));
  const dateStart = startOfDay(new Date());
  const getTimeStart = dateStart.getTime();
  const getTimeEnd = new Date(vehicle.billigEnd || "").getTime();

  const showData = () => (
    <>
      {isActive && <BackDrop state={isActive} />}
      <TableRow>
        <TableCell component="th" scope="row">
          {String(vehicle.id).toUpperCase()}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.vehicle.customer.name} {vehicle.vehicle.customer.lastName}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {vehicle.vehicle.customer.cellphone_1}{" "}
          {vehicle.vehicle.customer.cellphone_2}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.renovationStart).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.expirationDate).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.renovationEnd).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.vehicle.device.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.vehicle.platform}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.billing.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.vehicle.plate}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.vehicle.sim}
        </TableCell>
        <TableCell component="th" scope="row">
          {vehicle.vehicle.nroGPS}
        </TableCell>
        <TableCell align="center">
          {/* boton para pdf guia de usuario */}
          <Tooltip
            title="Generar comprobante"
            onClick={() => {
              let FechaActualizada;
              if (vehicle.renovationStart > vehicle.expirationDate) {
                FechaActualizada = vehicle.renovationStart;
              } else {
                FechaActualizada = vehicle.expirationDate;
              }
              GenerarComprobante(
                vehicle.vehicle,
                vehicle.renovationEnd,
                moment(FechaActualizada).format("DD/MM/YYYY"),
                vehicle.billing.name,
                vehicle.id
              );
            }}
          >
            <IconButton aria-label="user" size="small">
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, page, showData)}</>;
};

export default VehicleConsultRenovaciones;
