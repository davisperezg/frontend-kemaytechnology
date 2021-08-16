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
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import { setAlert } from "../store/alert/action";
import { Dialog } from "../interfaces/dialog.interface";
import { PERMIT_ONE } from "../const";
import DialogForm from "../components/dialog/dialog.component";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import { TablePaginationActions } from "../components/table/table-pagination";

const initialDialog = {
  name: "",
  active: false,
};

const initialAlert = {
  type: "",
  text: "",
};

const VehiclesPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { data, loading, error } = useGetVehicles();
  //TABLE OPTIONS
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pagex, setPage] = useState(0);

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
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  const showDialogToCreate = () => (
    <>
      <Tooltip title="Crear vehiculo">
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
        title={`${dialog.name} Vehiculo`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      {loadAccess(PERMIT_ONE, auth, page, showDialogToCreate)}
      <TableContainer
        component={Paper}
        style={{ whiteSpace: "nowrap", marginTop: 10 }}
      >
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Dispositivo</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Chip</TableCell>
              <TableCell>Nro GPS</TableCell>
              <TableCell>Fecha de instalación</TableCell>
              <TableCell>Fecha de termino</TableCell>
              <TableCell>Registrado por</TableCell>
              <TableCell>Actualizado por</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
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
