import moment from "moment";
import { Ingress } from "../../interfaces/ingress.interface";
import { formatMoney } from "../../lib/currency/money";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import IconButton from "@mui/material/IconButton";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
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
  //const classes = useStyles();
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const { module, page } = useSelector((state: any) => {
    return state.page.user;
  });
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
        onClick={() => setDialog({ name: "Ingreso", active: true })}
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
        <TableCell
          component="th"
          scope="row"
          style={{
            wordBreak: "break-all",
          }}
        >
          {ingres.category.name}
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          style={{ wordBreak: "break-all" }}
        >
          {ingres.detail}
        </TableCell>
        {page === "RESUMEN-CAJA" || (
          <>
            <TableCell
              component="th"
              scope="row"
              style={{ wordBreak: "break-all" }}
            >
              {ingres.observation}
            </TableCell>

            {/* <TableCell>
              {moment(ingres.createdAt).format("DD/MM/YYYY")}
            </TableCell>
            <TableCell>
              {moment(ingres.updatedAt).format("DD/MM/YYYY")}
            </TableCell> */}
          </>
        )}
        <TableCell component="th" scope="row">
          {ingres?.user?.name}
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {ingres.units}
        </TableCell>
        <TableCell component="th" scope="row" align="right">
          {formatMoney(ingres.amount)}
        </TableCell>
        <TableCell component="th" scope="row" align="right">
          {formatMoney(ingres.units * ingres.amount)}
        </TableCell>

        {page === "RESUMEN-CAJA" || page === "CONSULTAR-CAJA" ? (
          ""
        ) : (
          <TableCell component="th" scope="row" align="right">
            <>
              {loadAccess(PERMIT_TWO, auth, module, showOptionsForEdit)}
              {loadAccess(PERMIT_TREE, auth, module, showOptionsForDelete)}
            </>
          </TableCell>
        )}
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
      {loadAccess(PERMIT_FOUR, auth, module, showData)}
    </>
  );
};

export default IngressList;
