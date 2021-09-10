import jsPDF from "jspdf";
import { Vehicle } from "../../interfaces/vehicle.interface";
import {
  inicio_pagina_cel,
  lista_pagina_cel,
  logo,
  menu_pablo,
  mostrar_accesso_directo_inicio,
  nombre_pagina_cel,
  pablo_login,
  reporte_pablo,
  wialon_cel1,
  wialon_cel2,
  wialon_cel3,
  wialon_cel_uso,
  wialon_configuracion,
  wialon_extra,
  wialon_login,
  wialon_mapa,
  wialon_menu,
  wialon_seguimiento,
  wialon_unidades,
  wialon_unidades2,
} from "../images_data64/data64";
import moment from "moment";

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
    message = `https://hosting.wialon.com`;
  } else {
    message = "SIN PLATAFORMA";
  }
  return message;
};

export const GenerarGuiaUSua = (vehicle: Vehicle) => {
  if (vehicle!.platform === "SIN PLATAFORMA") return;
  const doc = new jsPDF();
  const top = 40;
  const left = 10;
  const title = "ALTA DE USUARIO";
  const subtitle = "INDICACIONES PARA INGRESAR A LA PLATAFORMA WEB GPS";
  const messageCustomer =
    "A continuación detallamos los pasos para el monitoreo de su unidad por nuestra plataforma web:";

  const step1 =
    "1. Deberás ingresar por la siguiente página web desde su PC o laptop";

  const step2 =
    "2. Ingresar sus credenciales (Las credenciales son las mismas para el aplicativo móvil)";

  const nameCustomer =
    "SR(A): " + vehicle.customer.name + " " + vehicle.customer.lastName;
  const plan = vehicle!.platform;
  const account = `${checkPlatform(vehicle)}`;
  const linkPage = `${checkPage(vehicle)}`;

  const step3 = `3. Verificar vehiculos agregados a su cuenta`;
  const step3steps1 = `3.1 Ir a la pestaña "Unidades"`;
  const step3steps2 = `3.2 Debe mostrarse la(s) placa(s) de su vehiculo(s)`;

  const step4 = `4. Configurar parametros de cuenta`;
  const step5 = `5. Visualizar ubicación actual del vehículo, en caso no aparezca configurar seguimiento como en la imagen mostrada a continuación: `;

  const step6 = `6. Como en el paso 4 ha configurado "Mapas", Ud puede cambiar a como le facilite mejor la visualización del vehiculo como señala la imagen mostrada a continuación:`;

  const step7 = `7) Inicio y Explicación movil`;
  const step7_message = `En caso su vehículo no aparezca`;
  const step8 = `8) Dato extra ubicación y coordenadas`;

  const titulo_datos_instalacion = `Datos de la instalación:`;
  const inifin = `Fecha de alta y vencimiento: ${moment(
    vehicle.billigStart
  ).format("DD/MM/YYYY")} - ${moment(vehicle.billigEnd).format("DD/MM/YYYY")}`;
  const placa = `Placa: ${vehicle.plate}`;

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

  //logo
  doc.addImage(logo, "JPG", left + 153, 5, 35, 30);
  //

  doc.setFontSize(25);
  doc.setTextColor(18, 70, 116);
  doc.setFont("helvetica", "bold");
  doc.text(title, left + 55, top);
  doc.setTextColor(0, 0, 0);
  doc.setFont("courier", "normal");
  const subtitle_message = doc.splitTextToSize(subtitle + " - " + plan, 192);
  doc.text(subtitle_message, left, top + 10);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const message = doc.splitTextToSize(messageCustomer, 192);
  doc.text(nameCustomer, left + 55, top + 35);
  //doc.text(plan, left, top + 45);
  doc.text(message, left, top + 45);

  const step1_message = doc.splitTextToSize(step1, 192);
  doc.text(step1_message, left, top + 55);
  doc.setFont("helvetica", "bold");
  doc.text(linkPage, left + 55, top + 65);
  doc.setFont("helvetica", "normal");

  const step2_message = doc.splitTextToSize(step2, 192);
  doc.text(step2_message, left, top + 75);
  doc.setFont("helvetica", "bold");
  doc.text(account, left + 55, top + 85);
  doc.setFont("helvetica", "normal");

  if (vehicle!.platform === "STANDAR") {
    doc.addImage(pablo_login, "PNG", left, top + 95, 190, 80);
    doc.addImage(menu_pablo, "PNG", left, top + 180, 190, 80);
    doc.addPage();

    doc.text(ReportePablo, left, top - 30);
    doc.addImage(reporte_pablo, "PNG", left, top - 20, 190, 100);
    doc.text(CEL_pablo, left, top + 90);
    doc.addImage(inicio_pagina_cel, "PNG", left, top + 100, 80, 100);
    doc.addPage();

    doc.text(SeleccionIncio, left, top - 30);
    doc.addImage(lista_pagina_cel, "PNG", left, top - 20, 80, 100);
    doc.text(CambioNombre, left, top + 90);
    doc.addImage(nombre_pagina_cel, "PNG", left, top + 100, 80, 100);
    doc.addPage();

    doc.text(IrAtuPantalla, left, top - 30);
    doc.addImage(
      mostrar_accesso_directo_inicio,
      "PNG",
      left,
      top - 20,
      80,
      100
    );
    doc.text(IrAtuPantalla, left, top);
    doc.setFont("helvetica", "bold");
    doc.text(Comandos, left, top + 90);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    if (vehicle.device.name === "SUNTECH ST340LC") {
      doc.text("Apagado", left, top + 100);
      doc.text("Encendido", left, top + 110);
    } else if (vehicle.device.name === "TELTONIKA FMB920") {
      doc.text(
        "Apagado: (espacio)(espacio)setdigout(espacio)1",
        left,
        top + 100
      );
      doc.text(
        "Encendido (espacio)(espacio)setdigout(espacio)0",
        left,
        top + 110
      );
    } else {
      doc.text("Apagado: stopelec123456", left, top + 100);
      doc.text("Encendido: supplyelect123456", left, top + 110);
    }
    if (vehicle!.sim === "MULTIOPERADOR") {
      //imagenes pltaforma cecsar
    } else {
      //fin
      doc.text(
        `Enviar comandos via SMS al ${vehicle!.nroGPS}`,
        left,
        top + 130
      );
    }
  } else {
    //imagenes y comentarios del pdf guia
    doc.addImage(wialon_login, "PNG", left, top + 95, 190, 120);
    doc.addPage();
    doc.text(step3, left, top - 30);
    doc.text(step3steps1, left + 5, top - 25);
    doc.text(step3steps2, left + 5, top - 20);

    doc.addImage(wialon_unidades, "PNG", left, top - 15, 190, 40);
    doc.text(step4, left, top + 30);
    doc.addImage(wialon_configuracion, "PNG", left, top + 40, 190, 200);

    doc.addPage();
    const step5_message = doc.splitTextToSize(step5, 192);
    doc.text(step5_message, left, top - 30);
    doc.addImage(wialon_seguimiento, "PNG", left, top - 20, 190, 200);
    doc.addPage();

    const step6_message = doc.splitTextToSize(step6, 192);
    doc.text(step6_message, left, top - 30);
    doc.addImage(wialon_mapa, "PNG", left, top - 20, 190, 100);
    doc.text(step7, left, top + 90);
    doc.text(step7_message, left, top + 95);
    doc.addImage(wialon_cel_uso, "PNG", left, top + 100, 190, 150);

    doc.addPage();
    doc.addImage(wialon_cel2, "PNG", left, top - 40, 210, 120);
    doc.addPage();

    doc.text(step8, left, top - 30);
    doc.addImage(wialon_extra, "PNG", left, top - 20, 200, 150);
    doc.setFont("helvetica", "bold");
    doc.text(titulo_datos_instalacion, left, top + 150);
    doc.setFont("helvetica", "normal");
    doc.text(inifin, left, top + 160);
    doc.text(placa, left, top + 170);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(Comandos, left, top + 190);
    doc.setFont("helvetica", "normal");

    if (vehicle.device.name === "SUNTECH ST340LC") {
      doc.text("Apagado", left, top + 180);
      doc.text("Encendido", left, top + 190);
    } else if (vehicle.device.name === "TELTONIKA FMB920") {
      doc.text(
        "Apagado: (espacio)(espacio)setdigout(espacio)1",
        left,
        top + 180
      );
      doc.text(
        "Encendido (espacio)(espacio)setdigout(espacio)0",
        left,
        top + 190
      );
    } else {
      doc.text("Apagado: stopelec123456", left, top + 200);
      doc.text("Encendido: supplyelect123456", left, top + 210);
    }
    if (vehicle!.sim === "MULTIOPERADOR") {
      //imagenes pltaforma cecsar
    } else {
      //fin
      doc.text(
        `Enviar comandos via SMS al ${vehicle!.nroGPS}`,
        left,
        top + 230
      );
    }
  }
  doc.save("a4.pdf");
};
