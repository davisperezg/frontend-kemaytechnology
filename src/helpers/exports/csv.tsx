import { Button } from "@mui/material";
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
            contacto:
              data.customer.cellphone_1 + " " + data.customer.cellphone_2,
            dispositivo: data.device.name,
            plataforma: data.platform,
            plan_facturacion: data.billing.name,
            placa: data.plate,
            sim: data.sim,
            nro_sim: data.nroGPS,
            fecha_instalacion: data.createdAt,
            fecha_inicio: data.billigStart,
            fecha_termino: data.billigEnd,
            retirado: data.retired ? "SI" : "NO",
          };
        });
        break;

      case "RENOVACIONES":
        newData = csvData.map((data) => {
          return {
            id: data.vehicle.customer.id,
            cliente:
              data.vehicle.customer.name + " " + data.vehicle.customer.lastName,
            contacto:
              data.vehicle.customer.cellphone_1 +
              " " +
              data.vehicle.customer.cellphone_2,
            dispositivo: data.vehicle.device.name,
            plataforma: data.vehicle.platform,
            plan: data.billing.name,
            placa: data.vehicle.plate,
            sim: data.vehicle.sim,
            nro_sim: data.vehicle.nroGPS,
            fecha_expirada: data.expirationDate,
            fecha_revacion_creada: data.createdAt,
            fecha_renovada: data.renovationStart,
            fecha_termino: data.renovationEnd,
            retirado: data.vehicle.retired ? "SI" : "NO",
          };
        });
        break;

      case "VENCIDOS":
        newData = csvData.map((data) => {
          return {
            id: data.customer.id,
            cliente: data.customer.name + " " + data.customer.lastName,
            contacto:
              data.customer.cellphone_1 + " " + data.customer.cellphone_2,
            dispositivo: data.device.name,
            plataforma: data.platform,
            plan_facturacion: data.billing.name,
            placa: data.plate,
            sim: data.sim,
            nro_sim: data.nroGPS,
            fecha_instalacion: data.createdAt,
            fecha_inicio: data.billigStart,
            fecha_termino: data.billigEnd,
            retirado: data.retired ? "SI" : "NO",
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
