import moment from "moment";
import { Ingress } from "../../interfaces/ingress.interface";
import { formatMoney } from "../../lib/currency/money";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { Dialog } from "../../interfaces/dialog.interface";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { useState } from "react";
import { useDeleteIngress } from "../../hooks/ingress/useDeleteIngress";
import DialogForm from "../dialog/dialog.component";
import { findError } from "../../helpers/control-errors";
import IngressForm from "./IngressForm";
import { User } from "../../interfaces/user.interface";
import { useSelector } from "react-redux";
import { loadAccess } from "../acceso/filter-access.component";
import { PERMIT_FOUR, PERMIT_TREE, PERMIT_TWO } from "../../const";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const IngressList = ({ ingres }: { ingres: Ingress }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const dispatch = useDispatch();
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const optionsIngress = useDeleteIngress();

  const deleteIngress = async (id: string | undefined) => {
    try {
      await optionsIngress.deleteIngress({
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
      case "Ingreso":
        return <IngressForm ingres={ingres} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const showOptionsForEdit = () => (
    <>
      <Tooltip
        title="Editar ingreso"
        onClick={() => setDialog({ name: "Egreso", active: true })}
      >
        <IconButton aria-label="egress" size="small">
          <EditRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showOptionsForDelete = () => (
    <>
      <Tooltip
        title="Eliminar ingreso"
        onClick={() => deleteIngress(ingres.id)}
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
          {ingres.category.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {ingres.detail}
        </TableCell>
        <TableCell component="th" scope="row">
          {ingres.observation}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {ingres.units}
        </TableCell>
        <TableCell component="th" scope="row">
          {formatMoney(ingres.amount)}
        </TableCell>
        <TableCell component="th" scope="row">
          {formatMoney(ingres.units * ingres.amount)}
        </TableCell>
        <TableCell>{moment(ingres.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(ingres.updatedAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell component="th" scope="row" align="right">
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
        dialog={ingres}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default IngressList;
