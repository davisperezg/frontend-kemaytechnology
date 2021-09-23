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
import { Button } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";

const Consulta_vencidos =()=>{
  
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
    const auth: User = useSelector((state: any) => state.authReducer.authUser);
    const page = useSelector((state: any) => state.page.user.module);
    const [dialog, setDialog] = useState<Dialog>(initialDialog);
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
        } else if (calcDiff <= 1) {
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
  
    if (loading) {
      return <h1>Cargando...</h1>;
    }
  
    if (error) {
      return <h1>{findError(error)}</h1>;
    }
  
    const showDialogToCreate = () => (
      <>
        {/* <Button
          onClick={() => setDialog({ name: "Crear", active: true })}
          variant="contained"
          color="primary"
          endIcon={<AddRoundedIcon />}
        >
          NUEVA INS.
        </Button> */}
  
        {/* <Tooltip title="Crear vehiculo">
          <IconButton
            aria-label="add"
            size="small"
            onClick={() => setDialog({ name: "Crear", active: true })}
          >
            <AddRoundedIcon />
          </IconButton>
        </Tooltip> */}
      </>
    );
  
    return (
      <>
        <DialogForm
          open={dialog.active}
          title={`${dialog.name} Vehiculo`}
          component={component(dialog.name)}
          handleClose={handleClose}
        />
  
        <div style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "200px" }}>
            {loadAccess(PERMIT_ONE, auth, page, showDialogToCreate)}
            {/* {loadAccess(PERMIT_ONE, auth, page, showDialogToCreate)} */}
          </div>
          
          {/* <div style={{ display: "flex", alignItems: "center" }}>
            <label>Realizadas</label>
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
            <label>Por Vencer </label>
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
            <label> Vencidas</label>
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
        > */}
          {/* documentacion https://www.npmjs.com/package/material-ui-search-bar */}
          <SearchBar
            style={{width: "100%" }}
            placeholder="Puede buscar por nombres, apellidos, placa, plan de facturación, tipo de plataforma o nro de gps"
            value={searched}
            onChange={(searchVal) => requestSearch(searchVal)}
            onCancelSearch={() => cancelSearch()}
          />
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
                <TableCell>Fecha de instalación</TableCell>
                <TableCell>Fecha de Culminación</TableCell>
                <TableCell>Registrado por</TableCell>
                <TableCell>Actualizado por</TableCell>
                <TableCell>Fecha creada</TableCell>
                <TableCell>Fecha modificada</TableCell>
                <TableCell align="right">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {(rowsPerPage > 0
                ? vehicles.slice(
                    pagex * rowsPerPage,
                    pagex * rowsPerPage + rowsPerPage
                  )
                : vehicles
              ).map((vehicle) => (
                <VehicleList key={vehicle.id} vehicle={vehicle} />
              ))} */}
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
export default Consulta_vencidos;