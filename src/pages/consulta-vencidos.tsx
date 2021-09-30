import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import VehicleList from "../components/vehicle/vehicle-list";
import { User } from "../interfaces/user.interface";
import { Vehicle } from "../interfaces/vehicle.interface";
import { useGetVehicles } from "../hooks/vehicle/useGetVehicle";
import VehicleForm from "../components/vehicle/vehicle-form";
import { findError } from "../helpers/control-errors";
import { loadAccess } from "../components/acceso/filter-access.component";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { useSelector, useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { Dialog } from "../interfaces/dialog.interface";
import { PERMIT_ONE } from "../const";
import DialogForm from "../components/dialog/dialog.component";
import TablePagination from "@material-ui/core/TablePagination";
import { TablePaginationActions } from "../components/table/table-pagination";
import { Button, TextField } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import moment from "moment";
import VehicleConsult from "../components/consultas/consultas_instalaciones";
import { InputChange } from "../lib/types";
import { Consulta } from "../interfaces/consulta.interface";
import { useConsultaVencidos } from "../hooks/vehicle/useConsultaVencidos";

const ConsultaVencidos = () => {
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
  const optionsConsulta = useConsultaVencidos();

  //TABLE OPTIONS
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pagex, setPage] = useState(0);

  const [consulta, setConsulta] = useState<Consulta>(initialConsulta);

  const handleInput = (e: InputChange) => {
    setConsulta({
      ...consulta,
      [e.target.name]: e.target.value,
    });
    optionsConsulta.getVehiculosVencidosXFecha({
      variables: {
        desde: e.target.value,
        hasta: e.target.value,
      },
    });
    if (optionsConsulta.data) {
      // console.log(optionsConsulta.data.getVehiculosInstaladosXrango  )
      setVehicles(optionsConsulta.data.getVehiculosVencidosXFecha);
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

  useEffect(() => {
    if (consulta) {
      optionsConsulta.getVehiculosVencidosXFecha({
        variables: {
          desde: consulta.desde,
          hasta: consulta.hasta,
        },
      });

      if (optionsConsulta.data) {
        // console.log(optionsConsulta.data.getVehiculosInstaladosXrango  )
        setVehicles(optionsConsulta.data.getVehiculosVencidosXFecha);
      }
    }

    //calc cant vehiculos
  }, [optionsConsulta.data]);

  if (optionsConsulta.loading) {
    return <h1>Cargando...</h1>;
  }

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
      <div style={{ width: "100%", display: "flex", marginLeft: 900 }}>
        <Button variant="contained" size="large">
          Generar PDF
        </Button>
      </div>

      <TableContainer
        component={Paper}
        style={{ whiteSpace: "nowrap", marginTop: 10 }}
      >
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha de instalación</TableCell>
              <TableCell>Fecha Termino </TableCell>
              <TableCell>Dispositivo</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>SIM</TableCell>
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
  );
};
export default ConsultaVencidos;