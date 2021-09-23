import jsPDF from "jspdf";
import { Vehicle } from "../../interfaces/vehicle.interface";
import moment from "moment";
import { firm_digi, logo } from "../images_data64/data64";
import autoTable from "jspdf-autotable";
import { Renew } from "../../interfaces/renewinterface";

export const GenerarComprobante = (vehicle: Vehicle, param1:any) => 
       
{
  const obtenerPrecioxPLan = () => {
    let precio = "";
    if (vehicle.platform === "PREMIUM") {
      if (vehicle.billing.name === "PLAN ANUAL") {
        //aual premium
        precio = "280";
      } else if (vehicle.billing.name === "PLAN MENSUAL") {
        //mensual premium
        precio = "35";
      } else {
        //semanal premium
      }
    } else if (vehicle.platform === "STANDAR") {
      if (vehicle.billing.name === "PLAN ANUAL") {
        //aual standar
        precio = "250";
      } else if (vehicle.billing.name === "PLAN MENSUAL") {
        //mensual standar
        precio = "no especificado";
      } else {
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
  doc.rect(10, 10, 190, 130);
  //Contenido de la tabla
  doc.addImage(logo, "JPG", left + 3, 15, 35, 30);
  doc.addImage(firm_digi, "JPG", left + 114, 87, 45, 35);
  doc.line(100, 125, 190, 125);
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
  doc.text(nom2, 60, 63);
  doc.text(dni2, 150, 63);
  doc.setFontSize(12);
  const desc_message = doc.splitTextToSize(desc, 185);
  doc.text(desc_message, 15, 50);
  doc.setFontSize(12);
  doc.text(fechaEmi, 140, 35);
  doc.setFontSize(10);
  doc.text(firma, 125, 130);
  doc.text(ruc, 130, 135);
  autoTable(doc, {
    margin: { top: 65 },
    head: [["N°.GPS", "Plan", "Placa", "Fecha.I", "Fecha.F", "Monto"]],
    body: [
      [
        vehicle.nroGPS,
        vehicle.billing.name + " - " + vehicle!.platform,
        vehicle.plate,
        moment().format("DD/MM/YYYY"), //hoy
        moment(param1).format("DD/MM/YYYY"),
        "S/." + obtenerPrecioxPLan(),
      ],
    ],
  });

  doc.save(`CP-${vehicle.plate}`);
};
