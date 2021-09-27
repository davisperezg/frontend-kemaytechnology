import { Vehicle } from "../../interfaces/vehicle.interface";
import { findError } from "../../helpers/control-errors";
import moment from "moment";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import DialogForm from "../dialog/dialog.component";
import { useState } from "react";
import { setAlert } from "../../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import { useDeleteVehicle } from "../../hooks/vehicle/useDeleteVehicle";

import AutorenewRoundedIcon from "@material-ui/icons/AutorenewRounded";
import RenewForm from "../renew/renew-form";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
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

const VehicleConsult = ({ vehicle }: { vehicle: Vehicle }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const optionsVehicle = useDeleteVehicle();
  const [isActive, setActive] = useState<boolean>(false);


  const showData = () => (
    <>
      {isActive && <BackDrop state={isActive} />}
      <TableRow
        
      >
        <TableCell component="th" scope="row">
          {vehicle.customer.name} {vehicle.customer.lastName}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.billigStart).format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {moment(vehicle.billigEnd).format("DD/MM/YYYY")}
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
        {/* <TableCell component="th" scope="row">
          {vehicle.nroGPS}
        </TableCell> */}
       
      </TableRow>
    </>
  );

  return (
    <>
      
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default VehicleConsult;
