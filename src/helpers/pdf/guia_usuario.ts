import jsPDF from "jspdf";
import { Vehicle } from "../../interfaces/vehicle.interface";
import {
  inicio_pagina_cel,
  lista_pagina_cel,
  menu_pablo,
  mostrar_accesso_directo_inicio,
  nombre_pagina_cel,
  pablo_login,
  reporte_pablo,
  wialon_cel1,
  wialon_cel2,
  wialon_cel3,
  wialon_login,
  wialon_menu,
  wialon_unidades,
} from "../images_data64/data64";

const checkPlatform = (vehicle: Vehicle) => {
  let message = "";
  if (vehicle!.platform === "STANDAR") {
    message =
      "kemay/" + vehicle.customer.username + "/" + vehicle.customer.password;
  } else if (vehicle!.platform === "PREMIUM") {
    message = vehicle.customer.username + "/" + vehicle.customer.password;
  } else {
    message = "SIN PLATAFORMA";
  }
  return message;
};

const checkPage = (vehicle: Vehicle) => {
  let message = "";
  if (vehicle!.platform === "STANDAR") {
    message = "http://45.77.202.56:8056/track/Track";
  } else if (vehicle!.platform === "PREMIUM") {
    message = `https://hosting.wialon.com/ o descarguelo desde la Play Store o App Store como "Wialon"`;
  } else {
    message = "SIN PLATAFORMA";
  }
  return message;
};

export const GenerarGuiaUSua = (vehicle: Vehicle) => {
  if (vehicle!.platform === "SIN PLATAFORMA") return;
  const doc = new jsPDF();
  const top = 10;
  const left = 10;
  const title = "MANUAL DE INSTRUCCIONES";
  const messageCustomer =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique aspernatur veritatis, corporis eligendi, perferendis tempore fuga perspiciatis architecto odit quia porro, ab cupiditate obcaecati? Quam omnis modi error ut vel!";

  const nameCustomer = vehicle.customer.name + " " + vehicle.customer.lastName;
  const plan = vehicle.billing.name + " - " + vehicle!.platform;
  const account = `Credenciales: ${checkPlatform(vehicle)}`;
  const linkPage = `Link: ${checkPage(vehicle)}`;
  const PC = `Guia desde PC - Ingresar credenciales`;
  const MenuPablo = `Menu principal`;
  const ReportePablo = `Vehiculo reportando`;
  const CEL_pablo = `Guia desde celular - colocar como acceso directo`;
  const SeleccionIncio = `Seleccionar añadir a pantalla de inicio`;
  const CambioNombre = `Cambiar nombre a "GPS" y Añadir`;
  const IrAtuPantalla = `Listo. Ir a tu pantalla de inicio`;
  const Comandos = `Comandos para ${vehicle.device.name}`;
  const Reporte = `Usar este Paso si el Vehiculo no se ve en el Menu (OPCIONAL)`;
  const Guia_Cell = `Guia desde Celular`;
  const Paso1 = `Paso 1 : `;
  const com1 = `Instalar la Aplicación  desde Play Store o App Store`;
  const Paso2 = `Paso 2 : `;
  const com2 = `Permitir las notificaciones de la Aplicación`;
  const Paso3 = `Paso 3 : `;
  const com3 = `Ejecutar la aplicación e Ingresar a la Interfaz`;
  const com4 = `Explicación de cada componente de la Aplicación`;
  doc.setFontSize(24);
  doc.text(title, left + 35, top);

  doc.setFontSize(12);
  const message = doc.splitTextToSize(messageCustomer, 192);

  doc.text(message, left, top + 10);
  doc.text(nameCustomer, left, top + 35);
  doc.text(plan, left, top + 45);
  doc.text(account, left, top + 55);
  doc.text(linkPage, left, top + 65);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(PC, left, top + 75);
  if (vehicle!.platform === "STANDAR") {
    doc.addImage(pablo_login, "PNG", left, top + 85, 190, 100);
    doc.text(MenuPablo, left, top + 195);
    doc.addImage(menu_pablo, "PNG", left, top + 200, 190, 80);
    doc.addPage();
    doc.text(ReportePablo, left, top);
    doc.addImage(reporte_pablo, "PNG", left, top + 10, 190, 100);
    doc.text(CEL_pablo, left, top + 120);
    doc.addImage(inicio_pagina_cel, "PNG", left, top + 130, 80, 100);
    doc.addPage();
    doc.text(SeleccionIncio, left, top);
    doc.addImage(lista_pagina_cel, "PNG", left, top + 10, 80, 100);
    doc.text(CambioNombre, left, top + 120);
    doc.addImage(nombre_pagina_cel, "PNG", left, top + 130, 80, 100);
    doc.addPage();
    doc.text(IrAtuPantalla, left, top);
    doc.addImage(
      mostrar_accesso_directo_inicio,
      "PNG",
      left,
      top + 10,
      80,
      100
    );
    doc.text(IrAtuPantalla, left, top);
    doc.text(Comandos, left, top + 120);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    if (vehicle.device.name === "SUNTECH ST340LC") {
      doc.text("Apagado", left, top + 130);
      doc.text("Encendido", left, top + 140);
    } else if (vehicle.device.name === "TELTONIKA FMB920") {
      doc.text(
        "Apagado: (espacio)(espacio)setdigout(espacio)1",
        left,
        top + 130
      );
      doc.text(
        "Encendido (espacio)(espacio)setdigout(espacio)0",
        left,
        top + 140
      );
    } else {
      doc.text("Apagado: stopelec123456", left, top + 130);
      doc.text("Encendido: supplyelect123456", left, top + 140);
    }
    if (vehicle!.sim === "MULTIOPERADOR") {
      //imagenes pltaforma cecsar
    } else {
      //fin
      doc.text(
        `Enviar comandos via SMS al ${vehicle!.nroGPS}`,
        left,
        top + 150
      );
    }
  } else {
    //imagenes y comentarios del pdf guia
    doc.addImage(wialon_login, "PNG", left, top + 85, 190, 100);
    doc.text(MenuPablo, left, top + 195);
    doc.addImage(wialon_menu, "PNG", left, top + 200, 190, 80);
    doc.addPage();
    doc.text(Reporte, left, top + 10);
    doc.addImage(wialon_unidades, "PNG", left, top + 30, 130, 80);
    doc.text(Guia_Cell, left, top + 140);

    doc.text(Paso1, left, top + 160);
    doc.setFont("helvetica", "normal");
    doc.text(com1, left + 20, top + 170);
    doc.setFont("helvetica", "bold");
    doc.text(Paso2, left, top + 180);
    doc.setFont("helvetica", "normal");
    doc.text(com2, left + 20, top + 190);
    doc.setFont("helvetica", "bold");
    doc.text(Paso3, left, top + 200);
    doc.setFont("helvetica", "normal");
    doc.text(com3, left + 20, top + 210);
    doc.setFont("helvetica", "bold");
    doc.addPage();
    //Celular controles

    doc.text(com4, left + 20, top + 10);
    doc.addImage(wialon_cel1, "PNG", left, top + 20, 150, 110);
    doc.addImage(wialon_cel2, "PNG", left, top + 140, 150, 120);
    doc.addPage();
    doc.addImage(wialon_cel3, "PNG", left, top + 10, 150, 130);

    doc.text(Comandos, left, top + 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    if (vehicle.device.name === "SUNTECH ST340LC") {
      doc.text("Apagado", left, top + 170);
      doc.text("Encendido", left, top + 190);
    } else if (vehicle.device.name === "TELTONIKA FMB920") {
      doc.text(
        "Apagado: (espacio)(espacio)setdigout(espacio)1",
        left,
        top + 170
      );
      doc.text(
        "Encendido (espacio)(espacio)setdigout(espacio)0",
        left,
        top + 190
      );
    } else {
      doc.text("Apagado: stopelec123456", left, top + 170);
      doc.text("Encendido: supplyelect123456", left, top + 190);
    }
    if (vehicle!.sim === "MULTIOPERADOR") {
      //imagenes pltaforma cecsar
    } else {
      //fin
      doc.text(
        `Enviar comandos via SMS al ${vehicle!.nroGPS}`,
        left,
        top + 210
      );
    }
    doc.save("a4.pdf");
  }
};
