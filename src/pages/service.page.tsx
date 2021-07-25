import { useState, useEffect } from "react";
import { findError } from "../helpers/control-errors";
import { loadAccess } from "../components/acceso/filter-access.component";
import { PERMIT_ONE, PERMIT_TWO } from "../const";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAlert } from "../store/alert/action";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import Tooltip from "@material-ui/core/Tooltip";
import DialogForm from "../components/dialog/dialog.component";
import { Dialog } from "../interfaces/dialog.interface";
import IconButton from "@material-ui/core/IconButton";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { User } from "../interfaces/user.interface";

import { Service } from "../interfaces/service.interface";
import ServiceForm from "../components/service/service-form";
import ServiceList from "../components/service/service-list";
import { useGetServices } from "../hooks/service/useGetServices";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const ServicePage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();

  const { data, loading, error } = useGetServices();
  const [services, setServices] = useState<Service[]>([]);

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <ServiceForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setServices(data.getServices);
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
      <DialogForm
        open={dialog.active}
        title={`${dialog.name} Servicio`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <Tooltip title="Crear Servicio">
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
      {loadAccess(PERMIT_ONE, auth, page, showDialogToCreate)}
      <TableContainer component={Paper} style={{ marginTop: 10 }}>
        <Table
          //className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              <TableCell align="right">Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <ServiceList key={service.id} service={service} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ServicePage;
