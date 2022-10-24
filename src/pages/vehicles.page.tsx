import { Vehicle } from "../interfaces/vehicle.interface";
import { useGetVehicles } from "../hooks/vehicle/useGetVehicle";
import VehicleForm from "../components/vehicle/VehicleForm";
import { useState, useRef, useLayoutEffect, useMemo } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import {
  createColumnHelper,
  DisplayColumnDef,
  IdentifiedColumnDef,
} from "@tanstack/react-table";
import TableContainer from "../components/table/TableContainer";
import "../components/table/table.css";
import { Customer } from "../interfaces/customer.interface";
import { Device } from "../interfaces/device.interface";
import { Billing } from "../interfaces/billing.interface";
import "./css/vehicle.css";
import { InputChange } from "../lib/types";
import SearchTable from "../components/table/search/SearchTable";
import VehicleEdit from "../components/vehicle/VehicleEdit";
import { toast } from "react-toastify";
import { useDeleteVehicle } from "../hooks/vehicle/useDeleteVehicle";
import CloseIcon from "@mui/icons-material/Close";
import VehicleStatus from "../components/vehicle/VehicleStatus";
import { differenceInDays, format } from "date-fns";

const columnHelper = createColumnHelper<Vehicle>();

const defaultColumns = [
  columnHelper.display({
    id: "index",
    cell: (props) => Number(props.row.id) + 1,
    header: () => "#",
    classNameHeader: "div text-center",
    classNameBody: "div-row text-center",
    size: 28,
    minSize: 28,
  } as DisplayColumnDef<Vehicle, unknown>),
  columnHelper.accessor(
    (row) =>
      `${(row.customer as Customer).name} ${
        (row.customer as Customer).lastName
      }`,
    {
      id: "customer",
      cell: (info) => info.getValue(),
      classNameBody: "div-row",
      header: () => "Cliente",
      classNameHeader: "div",
      size: 100,
      minSize: 31,
    } as DisplayColumnDef<Vehicle, string>
  ),
  columnHelper.accessor(
    (row) =>
      `${(row.customer as Customer).cellphone_1} 
      ${
        (row.customer as Customer).cellphone_2
          ? " - " + (row.customer as Customer).cellphone_2
          : ""
      } ${
        (row.customer as Customer).direction
          ? " - " + (row.customer as Customer).direction
          : ""
      }`,
    {
      id: "info",
      cell: (info) => info.getValue(),
      classNameBody: "div-row",
      header: () => "Información",
      classNameHeader: "div",
      size: 100,
      minSize: 31,
    } as DisplayColumnDef<Vehicle, string>
  ),
  columnHelper.accessor((row) => `${(row.device as Device).name}`, {
    id: "device",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Dispositivo",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Vehicle, string>),
  columnHelper.accessor("platform", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Plataforma",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor((row) => `${(row.billing as Billing).name}`, {
    id: "billing",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Facturación",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Vehicle, string>),
  columnHelper.accessor("plate", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Placa",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("sim", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("nroGPS", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Nro de chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("createdAt", {
    cell: (info) => format(new Date(String(info.getValue())), "dd-MM-yyyy"),
    classNameBody: "div-row",
    header: () => "Fecha de instalación",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, Date>),
  columnHelper.accessor("billigStart", {
    cell: (info) => format(new Date(String(info.getValue())), "dd-MM-yyyy"),
    classNameBody: "div-row",
    header: () => "Fecha de inicio",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("billigEnd", {
    cell: (info) => format(new Date(String(info.getValue())), "dd-MM-yyyy"),
    classNameBody: "div-row",
    header: () => "Fecha de termino",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("retired", {
    cell: (info) => (info.getValue() ? "SI" : "NO"),
    classNameBody: "div-row text-center",
    header: () => "Retirado",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, boolean>),
  columnHelper.display({
    id: "delete",
    cell: (props) => {
      return <CloseIcon sx={{ fontSize: 18 }} htmlColor="red" />;
    },
    classNameBody: "div-row text-center",
    header: () => "Eliminar",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Vehicle, unknown>),
  // columnHelper.display({
  //   id: "status",
  //   cell: (props) => {
  //     return <VehicleStatus row={props.row} />;
  //   },
  //   classNameBody: "div-row text-center",
  //   header: () => "Estado",
  //   classNameHeader: "div text-center",
  //   size: 100,
  //   minSize: 31,
  // } as DisplayColumnDef<Vehicle, unknown>),
  columnHelper.accessor("status", {
    cell: (props) => {
      return <VehicleStatus row={props.row} />;
    },
    classNameBody: "div-row text-center",
    header: () => "Estado",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, any>),
  columnHelper.display({
    id: "actions",
    cell: (props) => "",
    header: () => "...",
    classNameHeader: "div text-center",
    size: 28,
    minSize: 28,
    enableResizing: false,
    enableSorting: false,
  } as DisplayColumnDef<Vehicle, unknown>),
];

const initialValueEdit: Vehicle = {
  customer: "",
  device: "",
  billing: "",
  plate: "",
  nroGPS: "",
  platform: "",
  sim: "",
  retired: false,
};

const VehiclesPage = () => {
  const { data, isLoading, isError, isFetching, error } = useGetVehicles();
  const [vehicleEdit, setVehicleEdit] = useState<Vehicle>(initialValueEdit);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { mutateAsync, isLoading: isLoadingDelete } = useDeleteVehicle();

  const searchComponent = useRef<HTMLInputElement>(null);

  const memoVehicles = useMemo(() => {
    const colorsError = ["VENCIDO", "ACTIVO", "POR VENCER"];
    let arrayVehicles: Vehicle[] = [];
    if (data) {
      arrayVehicles = data.map((add: Vehicle) => {
        const billingEnd = new Date(String(add.billigEnd));
        const diffDays = differenceInDays(billingEnd, new Date());
        return {
          ...add,
          status:
            diffDays > 7
              ? colorsError[1]
              : diffDays <= 7 && diffDays >= 0
              ? colorsError[2]
              : colorsError[0],
        };
      });
      if (search !== "") {
        const data = arrayVehicles
          .map((v) => {
            return {
              ...v,
              customerFullname:
                (v.customer as Customer).name +
                " " +
                (v.customer as Customer).lastName,
            };
          })
          .filter(
            (vv) =>
              vv.customerFullname
                .toLowerCase()
                .includes(search.trim().toLowerCase()) ||
              vv.plate.toLowerCase().includes(search.trim().toLowerCase()) ||
              (vv.billing as Billing).name
                .toLowerCase()
                .includes(search.trim().toLowerCase()) ||
              vv.nroGPS.toLowerCase().includes(search.trim().toLowerCase()) ||
              vv.platform.toLowerCase().includes(search.trim().toLowerCase())
          );
        arrayVehicles = data.map((x) => ({
          ...x,
          customer: {
            ...(x.customer as Customer),
            name: (x.customer as Customer).name,
            lastName: (x.customer as Customer).lastName,
          },
        }));
      }
      return arrayVehicles;
    }

    return arrayVehicles;
  }, [data, search]);

  const handleSearch = (e: InputChange) => {
    const value: string = (
      searchComponent.current?.value as string
    ).toUpperCase();
    setSearch(value);
  };

  const handleOpenModalForm = () => setOpenModal(true);
  const handleCloseModalForm = () => setOpenModal(false);

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setVehicleEdit(initialValueEdit);
  };

  const handleClick = (row: any) => {
    setOpenModalEdit(true);
    setVehicleEdit(row.original);
  };

  const handleDelete = async (row: any) => {
    const confirmAlert = window.confirm(
      `¿Estas seguro que deseas eliminar ${row.original.plate}?`
    );

    if (confirmAlert) {
      try {
        await mutateAsync({
          variables: {
            id: row.original.id,
          },
        });
      } catch (e) {
        const myErrors = JSON.parse(JSON.stringify(e)).response.errors.map(
          (a: any) => a.extensions.exception.response.message.map((b: any) => b)
        );
        toast.error(myErrors.map((a: any) => a));
      }
    }
  };

  useLayoutEffect(() => {
    if (searchComponent.current) {
      searchComponent.current.focus();
    }
  }, []);

  return (
    <>
      <VehicleForm open={openModal} handleClose={handleCloseModalForm} />

      {openModalEdit && (
        <VehicleEdit
          open={openModalEdit}
          handleClose={handleCloseModalEdit}
          entity={vehicleEdit}
        />
      )}

      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "200px" }}>
          <Button
            onClick={handleOpenModalForm}
            variant="contained"
            color="primary"
            size="small"
            endIcon={<AddRoundedIcon />}
          >
            Crear vehiculo
          </Button>
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
        <SearchTable
          handleSearch={handleSearch}
          searchComponent={searchComponent}
          placeholder="Buscar cliente, placa, plan de facturación, tipo de plataforma o nro de gps..."
        />
        {(isFetching || isLoadingDelete) && (
          <div
            style={{ display: "flex", marginLeft: 10, alignItems: "flex-end" }}
          >
            <label style={{ fontSize: 12 }}>
              {isLoadingDelete
                ? "Eliminando objeto..."
                : "Refrescando lista..."}
            </label>
          </div>
        )}
      </div>
      {isError ? (
        JSON.parse(JSON.stringify(error))
          .response.errors.map((a: any) =>
            a.extensions.exception.response.message.map((b: any) => b)
          )
          .map((b: any, i: number) => (
            <>
              <div
                key={i + 1}
                style={{ background: "red", color: "#fff", padding: 10 }}
              >
                {i + 1}.- {b}
              </div>
              <br />
            </>
          ))
      ) : (
        <TableContainer
          data={memoVehicles}
          columns={defaultColumns}
          loading={isLoading}
          onClickTr={handleClick}
          handleDelete={handleDelete}
        />
      )}

      {/* <TableContainer
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
      </TableContainer> */}
    </>
  );
};

export default VehiclesPage;
