import { Device } from "../../interfaces/device.interface";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import DialogForm from "../dialog/dialog.component";
import { useState } from "react";
import { setAlert } from "../../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import IconButton from "@mui/material/IconButton";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import moment from "moment";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { findError } from "../../helpers/control-errors";
import DeviceForm from "./device-form";
import { useDeleteDevice } from "../../hooks/device/useDeleteDevice";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const DeviceList = ({ device }: { device: Device }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const optionsCustomer = useDeleteDevice();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Device":
        return <DeviceForm device={device} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const deleteDevice = async (id: string | undefined) => {
    try {
      await optionsCustomer.deleteDevice({
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

  const showOptionsForDelete = () => (
    <>
      <Tooltip
        title="Eliminar dispositivo"
        onClick={() => deleteDevice(device.id)}
      >
        <IconButton aria-label="device" size="small">
          <HighlightOffRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showOptionsForEdit = () => (
    <>
      <Tooltip
        title="Editar dispositivo"
        onClick={() => setDialog({ name: "Device", active: true })}
      >
        <IconButton aria-label="device" size="small">
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showData = () => (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {device.name}
        </TableCell>

        <TableCell>{moment(device.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(device.updatedAt).format("DD/MM/YYYY")}</TableCell>
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
        dialog={device}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default DeviceList;
