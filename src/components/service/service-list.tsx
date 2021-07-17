import { Service } from "../../interfaces/service.interface";
import { useState } from "react";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import DialogForm from "../dialog/dialog.component";
import { PERMIT_FOUR, PERMIT_TWO } from "../../const";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import moment from "moment";
import { setAlert } from "../../store/alert/action";
import { loadAccess } from "../acceso/filter-access.component";
import ServiceForm from "./service-form";
import { formatMoney } from "../../lib/currency/money";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const ServiceList = ({ service }: { service: Service }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Servicio":
        return <ServiceForm service={service} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const showOptionsForEdit = () => (
    <>
      <DialogForm
        open={dialog.active}
        dialog={service}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <TableCell align="right">
        <Tooltip
          title="Editar Servicio"
          onClick={() => setDialog({ name: "Servicio", active: true })}
        >
          <IconButton aria-label="service" size="small">
            <EditRoundedIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );

  const showData = () => (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {service.category!.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {service.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {service.description}
        </TableCell>
        <TableCell component="th" scope="row">
          {formatMoney(service.price)}
        </TableCell>
        <TableCell>{moment(service.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(service.updatedAt).format("DD/MM/YYYY")}</TableCell>
        {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
      </TableRow>
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, page, showData)}</>;
};

export default ServiceList;
