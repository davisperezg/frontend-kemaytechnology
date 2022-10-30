import { Vehicle } from "../interfaces/vehicle.interface";
import { useState, useMemo } from "react";
import { Button, TextField } from "@mui/material";
import { InputChange } from "../lib/types";
import { Consulta } from "../interfaces/consulta.interface";
import { useConsultaInstalaciones } from "../hooks/vehicle/useConsultaInstalaciones";
import { ExportCSV } from "../helpers/exports/csv";
import {
  createColumnHelper,
  DisplayColumnDef,
  IdentifiedColumnDef,
} from "@tanstack/react-table";
import { Customer } from "../interfaces/customer.interface";
import { Device } from "../interfaces/device.interface";
import { Billing } from "../interfaces/billing.interface";
import { format } from "date-fns";
import TableContainer from "../components/table/TableContainer";

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
];

const initialConsulta: Consulta = {
  desde: "",
  hasta: "",
};

const ConsultaInstalaciones = () => {
  const [consulta, setConsulta] = useState<Consulta>(initialConsulta);
  const { data, isLoading, error, isError, refetch, fetchStatus } =
    useConsultaInstalaciones(consulta);

  const handleInput = (e: InputChange) => {
    setConsulta({
      ...consulta,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = () => refetch();

  const memoInstalaciones = useMemo(() => {
    if (data) return data;
  }, [data]);

  return (
    <>
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
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          value={consulta.hasta}
          style={{ marginRight: 20 }}
          id="outlined-hasta"
          name="hasta"
          onChange={handleInput}
          type="date"
          label="Fecha hasta"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button
          onClick={handleClick}
          variant="contained"
          color="primary"
          size="small"
        >
          Consultar
        </Button>
      </div>

      {/* Generar PDF */}
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <ExportCSV
          csvData={memoInstalaciones}
          nameTipoReporte="INSTALACIONES"
          fileName={`Vehiculos instalados desde ${consulta.desde} hasta ${consulta.hasta}`}
        />
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
          data={memoInstalaciones}
          columns={defaultColumns}
          loading={isLoading}
          idle={fetchStatus}
        />
      )}
    </>
  );
};
export default ConsultaInstalaciones;
