import { Vehicle } from "../../interfaces/vehicle.interface";

import moment from "moment";

import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import { useDeleteVehicle } from "../../hooks/vehicle/useDeleteVehicle";

import BackDrop from "../backdrop/backdrop";

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
  console.log(vehicle);

  const showData = () => (
    <>
      {isActive && <BackDrop state={isActive} />}
      <TableRow>
        <TableCell component="th" scope="row">
          {vehicle.vehicle.customer.name} {vehicle.vehicle.customer.lastName}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.expirationDate).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {vehicle.vehicle.renovationStart}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {vehicle.vehicle.renovationEnd}
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
      </TableRow>
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, page, showData)}</>;
};

export default VehicleConsultRenovaciones;
