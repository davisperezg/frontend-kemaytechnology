import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import CustomerForm from "../components/customer/customer-form";
import IconButton from "@material-ui/core/IconButton";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { Dialog } from "../interfaces/dialog.interface";
import { useState, useEffect } from "react";
import { User } from "../interfaces/user.interface";
import { PERMIT_ONE } from "../const";
import { setAlert } from "../store/alert/action";
import { Customer } from "../interfaces/customer.interface";
import CustomerList from "../components/customer/customer-list";
import { loadAccess } from "../components/acceso/filter-access.component";
import { findError } from "../helpers/control-errors";
import { useGetCustomers } from "../hooks/customer/useGetCustomer";

const initialDialog = {
  name: "",
  active: false,
};

const initialAlert = {
  type: "",
  text: "",
};

const CustomerPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { data, loading, error } = useGetCustomers();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <CustomerForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setCustomers(data.getCustomer);
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
      <Tooltip title="Crear Cliente">
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
        title={`${dialog.name} Cliente`}
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
              <TableCell>Nombres</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Nro. Documento</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Credenciales</TableCell>
              {/* <TableCell>Plan</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Nro GPS</TableCell> 
              <TableCell>Fecha de instalación</TableCell>
              <TableCell>Fecha de termino</TableCell> */}
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              <TableCell>Opciones</TableCell>
              {/* {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <CustomerList key={customer.id} customer={customer} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomerPage;
