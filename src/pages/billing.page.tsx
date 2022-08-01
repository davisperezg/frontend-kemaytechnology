import { loadAccess } from "../components/acceso/filter-access.component";
import BillingForm from "../components/billing/billing-form";
import BillingList from "../components/billing/billing-list";
import { findError } from "../helpers/control-errors";
import { Billing } from "../interfaces/billing.interface";
import { useState, useEffect } from "react";
import { User } from "../interfaces/user.interface";
import { PERMIT_ONE } from "../const";
import { setAlert } from "../store/alert/action";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@mui/material/Tooltip";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import IconButton from "@mui/material/IconButton";
import { useSelector, useDispatch } from "react-redux";
import { useGetBilling } from "../hooks/billing/useGetBilling";
import { Dialog } from "../interfaces/dialog.interface";

const initialDialog = {
  name: "",
  active: false,
};

const initialAlert = {
  type: "",
  text: "",
};

const BillingPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const [billings, setBillings] = useState<Billing[]>([]);
  const { data, loading, error } = useGetBilling();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <BillingForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setBillings(data.getBillings);
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
      <Tooltip title="Crear plan de facturación">
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
        title={`${dialog.name} Plan de facturación`}
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
              <TableCell>Dias</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              <TableCell align="right">Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billings.map((billing) => (
              <BillingList key={billing.id} billing={billing} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BillingPage;
