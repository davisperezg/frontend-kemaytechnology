import { findError } from "../../helpers/control-errors";
import { useDeleteBilling } from "../../hooks/billing/useDeleteBilling";
import { Billing } from "../../interfaces/billing.interface";
import BillingForm from "./billing-form";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import DialogForm from "../dialog/dialog.component";
import { useState } from "react";
import { setAlert } from "../../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";
import { loadAccess } from "../acceso/filter-access.component";
import moment from "moment";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import IconButton from "@mui/material/IconButton";
import { Dialog } from "../../interfaces/dialog.interface";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const BillingList = ({ billing }: { billing: Billing }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const optionsBilling = useDeleteBilling();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Plan":
        return <BillingForm billing={billing} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const deleteBilling = async (id: string | undefined) => {
    try {
      await optionsBilling.deleteBilling({
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
        onClick={() => deleteBilling(billing.id)}
      >
        <IconButton aria-label="egress" size="small">
          <HighlightOffRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showOptionsForEdit = () => (
    <>
      <Tooltip
        title="Editar plan de facturación"
        onClick={() => setDialog({ name: "Plan", active: true })}
      >
        <IconButton aria-label="billing" size="small">
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showData = () => (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {billing.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {billing.day}
        </TableCell>
        <TableCell>{moment(billing.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(billing.updatedAt).format("DD/MM/YYYY")}</TableCell>
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
        dialog={billing}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default BillingList;
