import jsPDF from "jspdf";
import { Vehicle } from "../../interfaces/vehicle.interface";
import moment from "moment";
import { firm_digi, logo } from "../images_data64/data64";
import autoTable from "jspdf-autotable";
import { Renew } from "../../interfaces/renewinterface";
import QRCode from "react-qr-code";

export const GenerarComprobante = (
  vehicle: Vehicle,
  param1: any,
  fechaDesde: any,
  renew: any,
  renewForm: any
) => {
  const obtenerPrecioxPLan = () => {
    let precio = "";
    if (vehicle.platform === "PREMIUM") {
      if (renew.billing === "PLAN ANUAL" || renew === "PLAN ANUAL") {
        //aual premium
        precio = "280";
      } else if (renew.billing === "PLAN MENSUAL" || renew === "PLAN MENSUAL") {
        //mensual premium
        precio = "35";
      } else {
        //semanal premium
        precio = "no especificado";
      }
    } else if (vehicle.platform === "STANDAR") {
      if (renew.billing === "PLAN ANUAL" || renew === "PLAN ANUAL") {
        //aual standar
        precio = "250";
      } else if (renew.billing === "PLAN MENSUAL" || renew === "PLAN MENSUAL") {
        //mensual standar
        precio = "no especificado";
      } else {
        precio = "no especificado";
        //semanal standar
      }
    } else {
      //nada
    }
    return precio;
  };

  const doc = new jsPDF();
  const left = 10;
  const titulo = "COMPROBANTE DE PAGO";
  const nom = "Nombres y Apellidos:   ";
  const dni = "N°.DNI :  ";
  const nom2 = "" + vehicle.customer.name + " " + vehicle.customer.lastName;
  const dni2 = "" + vehicle.customer.numDocument;
  const desc =
    "La renovación ha sido procesado correctamente. En unos momentos se hará la reactivación del servicio. Gracias por la comprensión. Se adjunta los datos de transacción.";
  const fechaEmi = "Fecha de emisión :  " + moment().format("DD/MM/YYYY");
  const firma = "Kemay Tecnology E.I.R.L";
  const ruc = "RUC:20605350802";

  doc.rect(10, 10, 190, 160);
  //Contenido de la tabla
  doc.addImage(logo, "JPG", left + 3, 15, 35, 30);
  doc.addImage(firm_digi, "JPG", left + 114, 110, 45, 35);
  doc.line(100, 150, 190, 150);
  //Codigo QR

  //Linea
  doc.setLineWidth(1.0);
  doc.line(50, 27, 172, 27);
  //
  doc.setFontSize(27);
  doc.setFont("Bahnschrift", "bold");
  doc.text(titulo, 50, 25);
  doc.setFontSize(13);
  doc.setFont("Bahnschrift", "bold");
  doc.text(nom, 15, 63);
  doc.text(dni, 130, 63);
  doc.setFontSize(12);
  doc.setFont("Bahnschrift", "normal");
  const nom2_message = doc.splitTextToSize(nom2, 70);
  doc.text(nom2_message, 60, 63);
  doc.text(dni2, 150, 63);
  doc.setFontSize(12);
  const desc_message = doc.splitTextToSize(desc, 185);
  doc.text(desc_message, 15, 50);
  doc.setFontSize(12);
  doc.text(fechaEmi, 140, 35);
  doc.text("ID de transacción:" + String(renewForm).toUpperCase(), 15, 138);
  doc.setFontSize(10);
  doc.text(firma, 125, 155);
  doc.text(ruc, 130, 160);
  autoTable(doc, {
    margin: { top: 70 },
    head: [["N°.GPS", "Plan", "Placa", "Fecha.I", "Fecha.F", "Monto"]],
    body: [
      [
        vehicle.nroGPS,
        `${renew.billing || renew} - ${vehicle.platform}`,
        vehicle.plate,
        fechaDesde,
        moment(param1).format("DD/MM/YYYY"),
        "S/." + obtenerPrecioxPLan(),
      ],
    ],
  });

  doc.save(`CP-${vehicle.plate}`);
};
