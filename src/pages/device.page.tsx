import { loadAccess } from "../components/acceso/filter-access.component";
import { findError } from "../helpers/control-errors";
import { Billing } from "../interfaces/billing.interface";
import { useState, useEffect } from "react";
import { User } from "../interfaces/user.interface";
import { PERMIT_ONE } from "../const";
import { setAlert } from "../store/alert/action";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@material-ui/core/Tooltip";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import IconButton from "@material-ui/core/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { Dialog } from "../interfaces/dialog.interface";
import DeviceList from "../components/device/device-list";
import { useGetDevices } from "../hooks/device/useGetDevice";
import DeviceForm from "../components/device/device-form";

const initialDialog = {
  name: "",
  active: false,
};

const initialAlert = {
  type: "",
  text: "",
};

const DevicePage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const [devices, setDevices] = useState<Billing[]>([]);
  const { data, loading, error } = useGetDevices();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <DeviceForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setDevices(data.getDevices);
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  const showDialogToCreate = () => (
    <>
      <Tooltip title="Crear dispositivo">
        <IconButton
          aria-label="add"
          size="small"
          onClick={() => setDialog({ name: "Crear", active: true })}
        >
          <AddRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <>
      <DialogForm
        open={dialog.active}
        title={`${dialog.name} Dispositivo`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_ONE, auth, page, showDialogToCreate)}
      <TableContainer
        component={Paper}
        style={{ marginTop: 10, whiteSpace: "nowrap" }}
      >
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              <TableCell align="right">Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => (
              <DeviceList key={device.id} device={device} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DevicePage;
