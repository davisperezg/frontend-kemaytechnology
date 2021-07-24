import { Egress } from "../../interfaces/egress.interface";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";
import { formatMoney } from "../../lib/currency/money";
import Tooltip from "@material-ui/core/Tooltip";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { useState } from "react";
import { useDeleteEgress } from "../../hooks/egress/useDeleteEgress";
import { Dialog } from "../../interfaces/dialog.interface";
import DialogForm from "../dialog/dialog.component";
import { findError } from "../../helpers/control-errors";
import EgressForm from "./EgressForm";
import { useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";
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

const EgressList = ({ egres }: { egres: Egress }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const dispatch = useDispatch();
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const optionsEgress = useDeleteEgress();

  const deleteEgress = async (id: string | undefined) => {
    try {
      await optionsEgress.deleteEgress({
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
      case "Egreso":
        return <EgressForm egress={egres} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const showOptionsForEdit = () => (
    <>
      <Tooltip
        title="Editar egreso"
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
      <Tooltip title="Eliminar egreso" onClick={() => deleteEgress(egres.id)}>
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
          {egres.category.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {egres.detail}
        </TableCell>
        <TableCell component="th" scope="row">
          {egres.observation}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {egres.units}
        </TableCell>
        <TableCell component="th" scope="row">
          {formatMoney(egres.amount)}
        </TableCell>
        <TableCell component="th" scope="row">
          {formatMoney(egres.units * egres.amount)}
        </TableCell>
        <TableCell>{moment(egres.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(egres.updatedAt).format("DD/MM/YYYY")}</TableCell>
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
        dialog={egres}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_FOUR, auth, page, showData)}
    </>
  );
};

export default EgressList;
