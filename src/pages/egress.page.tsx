import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { useState, useEffect, useContext, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import { Egress } from "../interfaces/egress.interface";
import EgressList from "../components/egress/EgressList";
import { useGetEgress } from "../hooks/egress/useGetEgress";
import IconButton from "@material-ui/core/IconButton";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { findError } from "../helpers/control-errors";
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@material-ui/core/Tooltip";
import { Dialog } from "../interfaces/dialog.interface";
import { setAlert } from "../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import EgressForm from "../components/egress/EgressForm";
import { loadAccess } from "../components/acceso/filter-access.component";
import { PERMIT_ONE } from "../const";
import { User } from "../interfaces/user.interface";
import { formatMoney } from "../lib/currency/money";
import { PagoContext } from "../context/caja-context";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const EgressPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const { module, page } = useSelector((state: any) => {
    return state.page.user;
  });
  const [egress, setEgress] = useState<Egress[]>([]);
  const { data, loading, error } = useGetEgress();
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const { summaryEgress, setSummaryEgress } = useContext(PagoContext);

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const calTotalHoy = (items: Egress[]) => {
    return items
      .map((item) => item.units * item.amount)
      .reduce((sum, i) => sum + i, 0);
  };

  const totalHoy = calTotalHoy(egress);

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <EgressForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setEgress(data.getEgress);
    }
    setSummaryEgress({ ...summaryEgress, egress: totalHoy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setSummaryEgress, totalHoy]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  const showOptionsToCreate = () => (
    <>
      <Tooltip title="Crear Egreso">
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
        title={`${dialog.name} Egreso`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {page === "RESUMEN-CAJA"
        ? ""
        : loadAccess(PERMIT_ONE, auth, module, showOptionsToCreate)}

      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow style={{ background: "#dc3545" }}>
              <TableCell
                style={{ color: "#fff" }}
                align="center"
                colSpan={page === "RESUMEN-CAJA" ? 4 : 6}
              >
                Egreso de hoy
              </TableCell>
              <TableCell
                style={{ color: "#fff" }}
                align="center"
                colSpan={page === "RESUMEN-CAJA" ? 2 : 3}
              >
                Costo
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell>Detalle</TableCell>
              {page === "RESUMEN-CAJA" || (
                <>
                  <TableCell>Observación</TableCell>
                  <TableCell>Fecha creada</TableCell>
                  <TableCell>Fecha modificada</TableCell>
                </>
              )}
              <TableCell align="center">Unidades</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell align="right">Monto total</TableCell>
              {page === "RESUMEN-CAJA" || <TableCell>Opciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {egress.map((egres) => (
              <EgressList key={egres.id} egres={egres} />
            ))}

            <TableRow>
              <TableCell colSpan={page === "RESUMEN-CAJA" ? 3 : 6} />
              <TableCell>
                <strong>Total</strong>
              </TableCell>
              <TableCell align="right">
                <strong style={{ color: "red" }}>
                  {formatMoney(totalHoy)}
                </strong>
              </TableCell>
              {page === "RESUMEN-CAJA" ? "" : <TableCell colSpan={3} />}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EgressPage;
