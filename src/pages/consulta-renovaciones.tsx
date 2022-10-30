import { Vehicle } from "../interfaces/vehicle.interface";
import { useState, useMemo, useRef } from "react";
import { Button, TextField } from "@mui/material";
import { Consulta } from "../interfaces/consulta.interface";
import { InputChange } from "../lib/types";
import { useConsultaRenovaciones } from "../hooks/vehicle/useConsultaRenovaciones";
import { ExportCSV } from "../helpers/exports/csv";
import TableContainer from "../components/table/TableContainer";
import SearchTable from "../components/table/search/SearchTable";
import { createColumnHelper, DisplayColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Customer } from "../interfaces/customer.interface";
import { Device } from "../interfaces/device.interface";
import { Billing } from "../interfaces/billing.interface";
import { Renew } from "../interfaces/renewinterface";

const columnHelper = createColumnHelper<Renew>();

const defaultColumns = [
  columnHelper.display({
    id: "index",
    cell: (props) => Number(props.row.id) + 1,
    header: () => "#",
    classNameHeader: "div text-center",
    classNameBody: "div-row text-center",
    size: 28,
    minSize: 28,
  } as DisplayColumnDef<Renew, unknown>),
  columnHelper.accessor(
    (row) =>
      `${(row.vehicle.customer as Customer).name} ${
        (row.vehicle.customer as Customer).lastName
      }`,
    {
      id: "customer",
      cell: (info) => info.getValue(),
      classNameBody: "div-row",
      header: () => "Cliente",
      classNameHeader: "div",
      size: 100,
      minSize: 31,
    } as DisplayColumnDef<Renew, string>
  ),
  columnHelper.accessor(
    (row) =>
      `${(row.vehicle.customer as Customer).cellphone_1}
       ${
         (row.vehicle.customer as Customer).cellphone_2
           ? " - " + (row.vehicle.customer as Customer).cellphone_2
           : ""
       } ${
        (row.vehicle.customer as Customer).direction
          ? " - " + (row.vehicle.customer as Customer).direction
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
    } as DisplayColumnDef<Renew, string>
  ),
  columnHelper.accessor((row) => `${(row.vehicle.device as Device).name}`, {
    id: "device",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Dispositivo",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${(row.vehicle as Vehicle).platform}`, {
    id: "platform",
    cell: (info: any) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Plataforma",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${(row.billing as Billing).name}`, {
    id: "billing",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Facturación",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${(row.vehicle as Vehicle).plate}`, {
    id: "plate",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Placa",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${(row.vehicle as Vehicle).sim}`, {
    id: "sim",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${(row.vehicle as Vehicle).nroGPS}`, {
    id: "nroGPS",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Nro de chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${row.expirationDate}`, {
    id: "expirationDate",
    cell: (info) => format(new Date(String(info.getValue())), "dd-MM-yyyy"),
    classNameBody: "div-row",
    header: () => "Fecha expirada",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${row.createdAt}`, {
    id: "createdAt",
    cell: (info) => format(new Date(String(info.getValue())), "dd-MM-yyyy"),
    classNameBody: "div-row",
    header: () => "Fecha de renovación creada",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${row.renovationStart}`, {
    id: "renovationStart",
    cell: (info) => format(new Date(String(info.getValue())), "dd-MM-yyyy"),
    classNameBody: "div-row",
    header: () => "Fecha renovada",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${row.renovationEnd}`, {
    id: "renovationEnd",
    cell: (info) => format(new Date(String(info.getValue())), "dd-MM-yyyy"),
    classNameBody: "div-row",
    header: () => "Fecha de termino",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
  columnHelper.accessor((row) => `${(row.vehicle as Vehicle).retired}`, {
    id: "retired",
    cell: (info) => (info.getValue() === "true" ? "SI" : "NO"),
    classNameBody: "div-row text-center",
    header: () => "Retirado",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Renew, string>),
];

const initialConsulta: Consulta = {
  desde: "",
  hasta: "",
};

const ConsultaRenovaciones = () => {
  const [searched, setSearched] = useState<string>("");
  const [consulta, setConsulta] = useState<Consulta>(initialConsulta);
  const { data, isLoading, error, isError, refetch, fetchStatus } =
    useConsultaRenovaciones(consulta);
  const refInput = useRef<HTMLInputElement>(null);

  const handleSearch = (e: InputChange) => {
    const value: string = (refInput.current?.value as string).toUpperCase();
    setSearched(value);
  };

  const handleInput = (e: InputChange) => {
    setConsulta({
      ...consulta,
      [e.target.name]: e.target.value,
    });
  };

  const memoRenovaciones = useMemo(() => {
    let dataInstalaciones: any[] = [];

    if (data) {
      dataInstalaciones = data;

      if (searched !== "") {
        dataInstalaciones = data.filter((row: any) => {
          return (
            row.vehicle.plate
              .toLowerCase()
              .includes(searched.trim().toLowerCase()) ||
            row.vehicle.nroGPS
              .toLowerCase()
              .includes(searched.trim().toLowerCase()) ||
            row.id.toLowerCase().includes(searched.trim().toLowerCase())
          );
        });
      }
    }

    return dataInstalaciones;
  }, [data, searched]);

  const handleClick = () => refetch();

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
          id="outlined-hasta"
          name="hasta"
          onChange={handleInput}
          type="date"
          label="Fecha hasta"
          variant="outlined"
          style={{ marginRight: 20 }}
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
          csvData={memoRenovaciones}
          nameTipoReporte="RENOVACIONES"
          fileName={`Vehiculos renovados desde ${consulta.desde} hasta ${consulta.hasta}`}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <SearchTable
          handleSearch={handleSearch}
          searchComponent={refInput}
          placeholder="Buscar placa, nro gps o id de renovación..."
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
          data={memoRenovaciones}
          columns={defaultColumns}
          loading={isLoading}
          idle={fetchStatus}
        />
      )}
    </>
  );
};
export default ConsultaRenovaciones;
