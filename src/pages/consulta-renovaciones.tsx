import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

import { User } from "../interfaces/user.interface";
import { Vehicle } from "../interfaces/vehicle.interface";
import VehicleForm from "../components/vehicle/vehicle-form";
import { findError } from "../helpers/control-errors";

import {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  useCallback,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { Dialog } from "../interfaces/dialog.interface";

import DialogForm from "../components/dialog/dialog.component";
import TablePagination from "@material-ui/core/TablePagination";
import { TablePaginationActions } from "../components/table/table-pagination";
import { TextField } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import moment from "moment";

import { Consulta } from "../interfaces/consulta.interface";
import { InputChange } from "../lib/types";
import VehicleConsultRenovaciones from "../components/consultas/consultas_renovaciones";
import { useConsultaRenovaciones } from "../hooks/vehicle/useConsultaRenovaciones";
import { ExportCSV } from "../helpers/exports/csv";
import { useGetVehicles } from "../hooks/vehicle/useGetVehicle";
import { useGetRenews } from "../hooks/renew/useGetRenew";

const ConsultaRenovaciones = () => {
  const now = moment().utc().local().format("YYYY-MM-DD");
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

  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data, loading, error } = useGetVehicles();
  const optionsConsulta = useConsultaRenovaciones();
  const optionListado = useGetRenews();

  //TABLE OPTIONS
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pagex, setPage] = useState(0);
  const [searched, setSearched] = useState<string>("");
  const [consulta, setConsulta] = useState<Consulta>(initialConsulta);

  const handleInput = (e: InputChange) => {
    setConsulta({
      ...consulta,
      [e.target.name]: e.target.value,
    });
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

  const requestSearch = (searchedVal: string) => {
    console.log("query");
    console.log(searchedVal);
    console.log("option");
    console.log(optionListado.data);
    console.log(optionListado?.data?.getRenews);
    const filteredRows =
      optionListado?.data?.getRenews.filter((row: any) => {
        console.log("row");
        console.log(row);
        return (
          row.vehicle.plate
            .toLowerCase()
            .includes(searchedVal.trim().toLowerCase()) ||
          row.vehicle.nroGPS
            .toLowerCase()
            .includes(searchedVal.trim().toLowerCase()) ||
          row.id.toLowerCase().includes(searchedVal.trim().toLowerCase())
        );
      }) || [];
    console.log("filter");
    console.log(filteredRows);
    setVehicles(filteredRows);
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <VehicleForm handleClose={handleClose} />;

      default:
        break;
    }
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };
  const memoizedResult = useCallback(() => {
    optionsConsulta.getVehiculosRenovadosXFecha({
      variables: {
        desde: consulta.desde,
        hasta: consulta.hasta,
      },
    });
  }, [consulta.desde, consulta.hasta]);

  useEffect(() => {
    memoizedResult();
    if (optionsConsulta.data) {
      setVehicles(optionsConsulta.data.getVehiculosRenovadosXFecha || []);
    }
  }, [memoizedResult, optionsConsulta.data, optionListado.data]);

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
          nameTipoReporte="RENOVACIONES"
          fileName={`Vehiculos renovados desde ${consulta.desde} hasta ${consulta.hasta}`}
        />
      </div>
      <SearchBar
        style={{ width: "100%" }}
        placeholder="Puede buscar por ID de transacción, placa o nro de gps"
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />
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
                  <TableCell>ID Transaccion</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>N°.Contacto</TableCell>
                  <TableCell>Fecha Renovada</TableCell>
                  <TableCell>Fecha Expirada</TableCell>
                  <TableCell>Nueva Fecha de Termino </TableCell>
                  <TableCell>Dispositivo</TableCell>
                  <TableCell>Plataforma</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>SIM</TableCell>
                  <TableCell>Nro SIM</TableCell>
                  <TableCell align="right">PDF Renovados</TableCell>
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
                  <VehicleConsultRenovaciones
                    key={vehicle.id}
                    vehicle={vehicle}
                  />
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
export default ConsultaRenovaciones;
