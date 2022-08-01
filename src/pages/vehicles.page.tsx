import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import VehicleList from "../components/vehicle/vehicle-list";
import { User } from "../interfaces/user.interface";
import { Vehicle } from "../interfaces/vehicle.interface";
import { useGetVehicles } from "../hooks/vehicle/useGetVehicle";
import VehicleForm from "../components/vehicle/VehicleForm";
import { findError } from "../helpers/control-errors";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useSelector, useDispatch } from "react-redux";
import TablePagination from "@mui/material/TablePagination";
import { TablePaginationActions } from "../components/table/table-pagination";
import { Button } from "@mui/material";

const initialDialog = {
  name: "",
  active: false,
};

const initialAlert = {
  type: "",
  text: "",
};

let contVencidosGlobal = 0;
let contXVencerGlobal = 0;
let contActivosGlobal = 0;

const VehiclesPage = () => {
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [contVencidos, setContVencidos] = useState<number>(0);
  const [contActivos, setContActivos] = useState<number>(0);
  const [contPorVencer, setContXVencer] = useState<number>(0);
  const { data, loading, error } = useGetVehicles();
  //TABLE OPTIONS
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pagex, setPage] = useState(0);
  const [searched, setSearched] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, vehicles.length - pagex * rowsPerPage);

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

  const buscarCantVehiculosXtipo = (array: Vehicle[]) => {
    setContVencidos(0);
    setContXVencer(0);
    setContActivos(0);
    contVencidosGlobal = 0;
    contXVencerGlobal = 0;
    contActivosGlobal = 0;

    const hoy = new Date().getTime();
    for (let index = 0; index < array.length; index++) {
      const vehicle = array[index];
      const fechaFin = vehicle.billigEnd
        ? new Date(vehicle.billigEnd).getTime()
        : new Date().getTime();
      const diff = fechaFin - hoy;
      const calcDiff = diff / (1000 * 60 * 60 * 24);
      if (hoy > fechaFin) {
        contVencidosGlobal++;
        setContVencidos(contVencidosGlobal);
      } else if (calcDiff <= 10) {
        contXVencerGlobal++;
        setContXVencer(contXVencerGlobal);
      } else {
        contActivosGlobal++;
        setContActivos(contActivosGlobal);
      }
    }
  };

  const requestSearch = (searchedVal: string) => {
    const filteredRows = data.getVehicles.filter((row: any) => {
      return (
        row.customer.name
          .toLowerCase()
          .includes(searchedVal.trim().toLowerCase()) ||
        row.customer.lastName
          .toLowerCase()
          .includes(searchedVal.trim().toLowerCase()) ||
        row.plate.toLowerCase().includes(searchedVal.trim().toLowerCase()) ||
        row.billing.name
          .toLowerCase()
          .includes(searchedVal.trim().toLowerCase()) ||
        row.nroGPS.toLowerCase().includes(searchedVal.trim().toLowerCase()) ||
        row.platform.toLowerCase().includes(searchedVal.trim().toLowerCase())
      );
    });
    setVehicles(filteredRows);
    buscarCantVehiculosXtipo(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
    buscarCantVehiculosXtipo(data.getVehicles);
  };

  useEffect(() => {
    if (data) {
      const allVehicles = data.getVehicles
        .map((vehicle: any) => {
          return {
            ...vehicle,
            billigStart: vehicle.billigStart
              ? new Date(vehicle.billigStart)
              : new Date(),
          };
        })
        .sort(
          (a: any, b: any) => b.billigStart.getTime() - a.billigStart.getTime()
        );
      setVehicles(allVehicles);
      buscarCantVehiculosXtipo(data.getVehicles);
    }
    //calc cant vehiculos
  }, [data]);

  const handleOpenModalForm = () => setOpenModal(true);
  const handleCloseModalForm = () => setOpenModal(false);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  return (
    <>
      {/* <DialogForm
        open={dialog.active}
        title={`${dialog.name} Vehiculo`}
        component={component(dialog.name)}
        handleClose={handleClose}
      /> */}
      <VehicleForm open={openModal} handleClose={handleCloseModalForm} />

      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "200px" }}>
          <Button
            onClick={handleOpenModalForm}
            variant="contained"
            color="primary"
            endIcon={<AddRoundedIcon />}
          >
            Crear vehiculo
          </Button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>Vehiculos activos</label>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#5bc959",
              marginLeft: 3,
              marginRight: 3,
            }}
          />
          <strong>{contActivos}</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginLeft: 20 }}>
          <label>Vehiculos por vencer</label>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#f7e160",
              marginLeft: 3,
              marginRight: 3,
            }}
          />
          <strong>{contPorVencer}</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginLeft: 20 }}>
          <label>Vehiculos vencidos</label>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#fc553f",
              marginLeft: 3,
              marginRight: 3,
            }}
          />
          <strong>{contVencidos}</strong>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          marginBottom: 10,
          width: "100%",
          display: "flex",
        }}
      >
        {/* documentacion https://www.npmjs.com/package/material-ui-search-bar */}
        aqui search
        {/* <SearchBar
          style={{ width: "100%" }}
          placeholder="Puede buscar por nombres, apellidos, placa, plan de facturación, tipo de plataforma o nro de gps"
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        /> */}
      </div>
      <TableContainer
        component={Paper}
        style={{ whiteSpace: "nowrap", marginTop: 10 }}
      >
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Dispositivo</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Chip</TableCell>
              <TableCell>Nro GPS</TableCell>
              <TableCell>Fecha de Inicio</TableCell>
              <TableCell>Fecha de Termino</TableCell>
              <TableCell>Registrado por</TableCell>
              <TableCell>Actualizado por</TableCell>
              <TableCell>Fecha Creada</TableCell>
              <TableCell>Fecha Modificada</TableCell>
              <TableCell align="right">Opciones</TableCell>
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
              <VehicleList key={vehicle.id} vehicle={vehicle} />
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

export default VehiclesPage;
