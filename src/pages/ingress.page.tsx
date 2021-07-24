import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";

import { Ingress } from "../interfaces/ingress.interface";
import IngressList from "../components/ingress/IngresList";
import { findError } from "../helpers/control-errors";
import { useGetIngress } from "../hooks/ingress/useGetIngress";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import DialogForm from "../components/dialog/dialog.component";
import IngressForm from "../components/ingress/IngressForm";
import { Dialog } from "../interfaces/dialog.interface";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../store/alert/action";
import { User } from "../interfaces/user.interface";
import { loadAccess } from "../components/acceso/filter-access.component";
import { PERMIT_ONE } from "../const";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const IngressPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [ingress, setIngress] = useState<Ingress[]>([]);
  const { data, loading, error } = useGetIngress();
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <IngressForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setIngress(data.getIngress);
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  const showOptionsToCreate = () => (
    <>
      <Tooltip title="Crear Ingreso">
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
        title={`${dialog.name} Ingreso`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_ONE, auth, page, showOptionsToCreate)}

      <TableContainer component={Paper} style={{ marginTop: 10 }}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell>Detalle</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Unidades</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingress.map((ingres) => (
              <IngressList key={ingres.id} ingres={ingres} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default IngressPage;
