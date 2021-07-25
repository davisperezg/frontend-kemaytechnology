import { Service } from "../../interfaces/service.interface";
import { useState } from "react";

import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import DialogForm from "../dialog/dialog.component";
import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import moment from "moment";
import { setAlert } from "../../store/alert/action";
import { loadAccess } from "../acceso/filter-access.component";
import ServiceForm from "./service-form";
import { formatMoney } from "../../lib/currency/money";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { findError } from "../../helpers/control-errors";
import { useDeleteService } from "../../hooks/service/useDeleteService";

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
  const optionsService = useDeleteService();

  const deleteService = async (id: string | undefined) => {
    try {
      await optionsService.deleteService({
        variables: {
          id,
        },
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
      <Tooltip
        title="Editar Servicio"
        onClick={() => setDialog({ name: "Servicio", active: true })}
      >
        <IconButton aria-label="service" size="small">
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showOptionsForDelete = () => (
    <>
      <Tooltip
        title="Eliminar egreso"
        onClick={() => deleteService(service.id)}
      >
        <IconButton aria-label="egress" size="small">
          <HighlightOffRoundedIcon />
        </IconButton>
      </Tooltip>
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

        <TableCell align="right">
          {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
          {loadAccess(PERMIT_TREE, auth, page, showOptionsForDelete)}
        </TableCell>
      </TableRow>
    </>
  );

  return (
    <>
      <DialogForm
        open={dialog.active}
        dialog={service}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default ServiceList;
