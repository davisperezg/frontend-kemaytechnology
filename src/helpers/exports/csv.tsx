import { Button } from "@material-ui/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportCSV = ({
  csvData,
  nameTipoReporte,
  fileName,
}: {
  csvData: any[];
  nameTipoReporte: string;
  fileName: string;
}) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const tipoReporte = (csvData: any[], tipo: string): any[] => {
    let newData: any[] = [];
    switch (tipo) {
      case "INSTALACIONES":
        newData = csvData.map((data) => {
          return {
            id: data.customer.id,
            cliente: data.customer.name + " " + data.customer.lastName,
            fecha_instalacion: data.createdAt,
            dispositivo: data.device.name,
            plataforma: data.platform,
            plan_facturacion: data.billing.name,
            placa: data.plate,
            sim: data.sim,
            nro_sim: data.nroGPS,
          };
        });
        break;

      case "RENOVACIONES":
        newData = csvData.map((data) => {
          return {
            id: data.vehicle.customer.id,
            cliente:
              data.vehicle.customer.name + " " + data.vehicle.customer.lastName,
            fecha_expirada: data.expirationDate,
            fecha_renovada: data.renovationStart,
            fecha_termina: data.renovationEnd,
            dispositivo: data.vehicle.device.name,
            plataforma: data.vehicle.platform,
            plan: data.billing.name,
            placa: data.vehicle.plate,
            sim: data.vehicle.sim,
            nro_sim: data.vehicle.nroGPS,
          };
        });
        break;

      case "VENCIDOS":
        newData = csvData.map((data) => {
          return {
            id: data.customer.id,
            cliente: data.customer.name + " " + data.customer.lastName,
            fecha_inicio: data.createdAt,
            fecha_termino: data.device.name,
            dispositivo: data.device.name,
            plataforma: data.platform,
            plan_facturacion: data.billing.name,
            placa: data.plate,
            sim: data.sim,
            nro_sim: data.nroGPS,
          };
        });
        break;

      default:
        newData = [];
        break;
    }
    return newData;
  };

  const exportToCSV = (csvData: any[], fileName: string) => {
    const arrayData = tipoReporte(csvData, nameTipoReporte);

    const ws = XLSX.utils.json_to_sheet(arrayData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button color="primary" onClick={(e) => exportToCSV(csvData, fileName)}>
      Exportar xmls
    </Button>
  );
};
