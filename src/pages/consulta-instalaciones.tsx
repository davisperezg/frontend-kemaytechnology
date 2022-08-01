import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";

import { Vehicle } from "../interfaces/vehicle.interface";

import VehicleForm from "../components/vehicle/vehicle-form";
import { findError } from "../helpers/control-errors";

import {
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
  MouseEvent,
} from "react";

import { setAlert } from "../store/alert/action";
import { Dialog } from "../interfaces/dialog.interface";

import TablePagination from "@mui/material/TablePagination";
import { TablePaginationActions } from "../components/table/table-pagination";
import { Button, TextField } from "@mui/material";

import VehicleConsult from "../components/consultas/consultas_instalaciones";
import { InputChange } from "../lib/types";
import { Consulta } from "../interfaces/consulta.interface";
import { useConsultaInstalaciones } from "../hooks/vehicle/useConsultaInstalaciones";
import { useDispatch } from "react-redux";
import DialogForm from "../components/dialog/dialog.component";
import { ExportCSV } from "../helpers/exports/csv";

const ConsultaInstalaciones = () => {
  const now = new Date();

  const initialDialog = {
    name: "",
    active: false,
  };

  const initialAlert = {
    type: "",
    text: "",
  };
  const initialConsulta: Consulta = {
    desde: now,
    hasta: now,
  };

  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const optionsConsulta = useConsultaInstalaciones();
  //TABLE OPTIONS

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pagex, setPage] = useState(0);

  const [consulta, setConsulta] = useState<Consulta>(initialConsulta);

  const handleInput = (e: InputChange) => {
    setConsulta({
      ...consulta,
      [e.target.name]: e.target.value,
    });
    optionsConsulta.getVehiculosInstaladosXrango({
      variables: {
        desde: e.target.value,
        hasta: e.target.value,
      },
    });
    if (optionsConsulta.data) {
      // console.log(optionsConsulta.data.getVehiculosInstaladosXrango  )
      setVehicles(optionsConsulta.data.getVehiculosInstaladosXrango);
    }
  };

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //TABLE FIN
  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <VehicleForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  const memoizedResult = useCallback(() => {
    optionsConsulta.getVehiculosInstaladosXrango({
      variables: {
        desde: consulta.desde,
        hasta: consulta.hasta,
      },
    });
  }, [consulta.desde, consulta.hasta]);

  useEffect(() => {
    memoizedResult();
    if (optionsConsulta.data) {
      setVehicles(optionsConsulta.data.getVehiculosInstaladosXrango);
    }
  }, [memoizedResult, optionsConsulta.data]);

  if (optionsConsulta.error) {
    return <h1>{findError(optionsConsulta.error)}</h1>;
  }

  return (
    <>
      <DialogForm
        open={dialog.active}
        title={`${dialog.name} Vehiculo`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />

      <div style={{ width: "100%", display: "flex" }}>
        <TextField
          value={consulta.desde}
          id="outlined-desde"
          onChange={handleInput}
          type="date"
          name="desde"
          label="Fecha desde"
          variant="outlined"
          style={{ marginRight: 20 }}
        />

        <TextField
          value={consulta.hasta}
          id="outlined-hasta"
          name="hasta"
          onChange={handleInput}
          type="date"
          label="Fecha hasta"
          variant="outlined"
        />
      </div>
      {/* Generar PDF */}
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <ExportCSV
          csvData={vehicles}
          nameTipoReporte="INSTALACIONES"
          fileName={`Vehiculos instalados desde ${consulta.desde} hasta ${consulta.hasta}`}
        />
      </div>
      {optionsConsulta.loading ? (
        <h1>Cargando...</h1>
      ) : (
        <>
          <TableContainer
            component={Paper}
            style={{ whiteSpace: "nowrap", marginTop: 10 }}
          >
            <Table stickyHeader size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>N°.Contacto</TableCell>
                  <TableCell>Fecha de instalación</TableCell>
                  <TableCell>Dispositivo</TableCell>
                  <TableCell>Plataforma</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>SIM</TableCell>
                  <TableCell>Nro SIM</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? vehicles.slice(
                      pagex * rowsPerPage,
                      pagex * rowsPerPage + rowsPerPage
                    )
                  : vehicles
                ).map((vehicle) => (
                  <VehicleConsult key={vehicle.id} vehicle={vehicle} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                25,
                { label: "Todos los registros", value: -1 },
              ]}
              //colSpan={3}
              style={{ borderBottom: "none" }}
              count={vehicles.length}
              rowsPerPage={rowsPerPage}
              page={pagex}
              SelectProps={{
                inputProps: { "aria-label": "filas por página" },
                native: true,
              }}
              labelRowsPerPage="filas por página"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </>
      )}
    </>
  );
};
export default ConsultaInstalaciones;
