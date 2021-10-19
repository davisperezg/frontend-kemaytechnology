import { Customer } from "../../interfaces/customer.interface";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import DialogForm from "../dialog/dialog.component";
import { useState } from "react";
import { setAlert } from "../../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import CustomerForm from "./customer-form";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import moment from "moment";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { useDeleteCustomer } from "../../hooks/customer/useDeleteCustomer";
import { findError } from "../../helpers/control-errors";
import { add } from "date-fns";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const CustomerList = ({ customer }: { customer: Customer }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const optionsCustomer = useDeleteCustomer();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Cliente":
        return <CustomerForm customer={customer} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const deleteCustomer = async (id: string | undefined) => {
    try {
      await optionsCustomer.deleteCustomer({
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
        title="Eliminar Cliente"
        onClick={() => deleteCustomer(customer.id)}
      >
        <IconButton aria-label="customer" size="small">
          <HighlightOffRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showOptionsForEdit = () => (
    <>
      <Tooltip
        title="Editar Cliente"
        onClick={() => setDialog({ name: "Cliente", active: true })}
      >
        <IconButton aria-label="customer" size="small">
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showData = () => (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {`${customer.name} ${
            customer.document === "RUC" ? "" : customer.lastName
          }`}
        </TableCell>
        <TableCell component="th" scope="row">
          {customer.document}
        </TableCell>
        <TableCell component="th" scope="row">
          {customer.numDocument}
        </TableCell>
        <TableCell component="th" scope="row">
          {customer.cellphone_2
            ? `${customer.cellphone_1}, ${customer.cellphone_2}`
            : `${customer.cellphone_1}`}
        </TableCell>
        <TableCell component="th" scope="row">
          {customer.direction}
        </TableCell>
        <TableCell component="th" scope="row">
          {moment(add(new Date(String(customer?.fecha_nac)), { days: 1 }))
            .utc()
            .local()
            .format("DD/MM/YYYY")}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {customer.username}/{customer.password}
        </TableCell>
        <TableCell>{moment(customer.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(customer.updatedAt).format("DD/MM/YYYY")}</TableCell>
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
        dialog={customer}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default CustomerList;
