/* eslint-disable react-hooks/exhaustive-deps */
import { useCreateVehicle } from "../../hooks/vehicle/useCreateVehicle";
import { useUpdateVehicle } from "../../hooks/vehicle/useUpdateVehicle";
import { Vehicle } from "../../interfaces/vehicle.interface";
import { FormChange, InputChange, SelectChange } from "../../lib/types";
import { findError } from "../../helpers/control-errors";
import { setAlert } from "../../store/alert/action";
import moment from "moment";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { Customer } from "../../interfaces/customer.interface";
import { useGetCustomers } from "../../hooks/customer/useGetCustomer";
import Button from "@material-ui/core/Button";
import Progress from "../progress/progress";
import DialogActions from "@material-ui/core/DialogActions";
import { Device } from "../../interfaces/device.interface";
import { Billing } from "../../interfaces/billing.interface";
import { useGetDevices } from "../../hooks/device/useGetDevice";
import { useGetBilling } from "../../hooks/billing/useGetBilling";
import RedditTextField from "../textfield/reddit";
import { MenuItem } from "@material-ui/core";
import { jsPDF } from "jspdf";
import {
  inicio_pagina_cel,
  lista_pagina_cel,
  menu_pablo,
  mostrar_accesso_directo_inicio,
  nombre_pagina_cel,
  pablo_login,
  reporte_pablo,
  wialon_login,
} from "../../helpers/images_data64/data64";

interface Option {
  handleClose?: () => void;
  vehicle?: Vehicle;
}

const VehicleForm = ({ handleClose, vehicle }: Option) => {
  const now = moment().utc().local().format("YYYY-MM-DD");

  const initialStateCreate: Vehicle = {
    customer: "",
    device: "",
    billing: "",
    plate: "",
    nroGPS: "",
    platform: "",
    sim: "",
    billigStart: now,
  };

  const initialStateUpdate: Vehicle = {
    id: vehicle?.id || "",
    customer: vehicle?.customer?.id || "",
    device: vehicle?.device?.name || "",
    billing: vehicle?.billing?.name || "",
    plate: vehicle?.plate || "",
    nroGPS: vehicle?.nroGPS || "",
    platform: vehicle?.platform || "",
    sim: vehicle?.sim || "",
    billigStart: moment(vehicle?.billigStart).format("YYYY-MM-DD") || now,
  };

  const [vehicleForm, setVehicleForm] = useState<Vehicle>(
    initialStateUpdate.id ? initialStateUpdate : initialStateCreate
  );

  const dispatch = useDispatch();
  const optionsUpdate = useUpdateVehicle();
  const optionsCreate = useCreateVehicle();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    lastName: "",
    document: "",
    numDocument: "",
    cellphone_1: "",
    username: "",
    password: "",
  });
  const [devices, setDevices] = useState<Device[]>([]);
  const [device, setDevice] = useState<Device>({
    name: "",
  });
  const [billings, setBillings] = useState<Billing[]>([]);
  const [billing, setBilling] = useState<Billing>({
    name: "",
  });
  const optionCustomer = useGetCustomers();
  const optionDevice = useGetDevices();
  const optionBilling = useGetBilling();

  const handleInput = (e: InputChange) => {
    setVehicleForm({
      ...vehicleForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e: SelectChange) => {
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  };

  const checkPlatform = () => {
    let message = "";
    if (vehicleForm!.platform === "STANDAR") {
      message = "kemay/" + customer.username + "/" + customer.password;
    } else if (vehicleForm!.platform === "PREMIUM") {
      message = customer.username + "/" + customer.password;
    } else {
      message = "SIN PLATAFORMA";
    }
    return message;
  };

  const checkPage = () => {
    let message = "";
    if (vehicleForm!.platform === "STANDAR") {
      message = "http://45.77.202.56:8056/track/Track";
    } else if (vehicleForm!.platform === "PREMIUM") {
      message = `https://hosting.wialon.com/ o descarguelo desde la Play Store o App Store como "Wialon"`;
    } else {
      message = "SIN PLATAFORMA";
    }
    return message;
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();
    // const getUserById = getUser
    if (vehicleForm!.platform === "SIN PLATAFORMA") return;
    const doc = new jsPDF();
    const top = 10;
    const left = 10;
    const title = "MANUAL DE INSTRUCCIONES";
    const messageCustomer =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique aspernatur veritatis, corporis eligendi, perferendis tempore fuga perspiciatis architecto odit quia porro, ab cupiditate obcaecati? Quam omnis modi error ut vel!";

    const nameCustomer = customer.name + " " + customer.lastName;
    const plan = billing.name + " - " + vehicleForm!.platform;
    const account = `Credenciales: ${checkPlatform()}`;
    const linkPage = `Link: ${checkPage()}`;
    const PC = `Guia desde PC - Ingresar credenciales`;
    const MenuPablo = `Menu principal`;
    const ReportePablo = `Vehiculo reportando`;
    const CEL_pablo = `Guia desde celular - colocar como acceso directo`;
    const SeleccionIncio = `Seleccionar añadir a pantalla de inicio`;
    const CambioNombre = `Cambiar nombre a "GPS" y Añadir`;
    const IrAtuPantalla = `Listo. Ir a tu pantalla de inicio`;
    const Comandos = `Comandos para ${device.name}`;

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
    if (vehicleForm!.platform === "STANDAR") {
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
      if (device.name === "SUNTECH ST340LC") {
        doc.text("Apagado", left, top + 130);
        doc.text("Encendido", left, top + 140);
      } else if (device.name === "TELTONIKA FMB920") {
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
      if (vehicleForm!.sim === "MULTIOPERADOR") {
        //imagenes pltaforma cecsar
      } else {
        //fin
        doc.text(
          `Enviar comandos via SMS al ${vehicleForm!.nroGPS}`,
          left,
          top + 150
        );
      }
    } else {
      //imagenes wialon
      doc.addImage(wialon_login, "PNG", left, top + 85, 150, 100);
    }

    doc.save("a4.pdf");

    const resAlert = window.confirm("¿ Deseas registrarlo como ingreso ? 🤔");

    if (resAlert) {
    } else {
      alert("is not");
    }

    // if (vehicleForm.id) {
    //   try {
    //     await optionsUpdate.updateVehicle({
    //       variables: {
    //         vehicleInput: vehicleForm,
    //       },
    //     });
    //     dispatch(
    //       setAlert({
    //         type: "success",
    //         text: "El vehiculo se actualizó correctamente.",
    //       })
    //     );
    //   } catch (e) {
    //     dispatch(
    //       setAlert({
    //         type: "error",
    //         text: findError(e),
    //       })
    //     );
    //   }
    // } else {
    //   try {
    //     await optionsCreate.registerVehicle({
    //       variables: {
    //         vehicleInput: vehicleForm,
    //       },
    //     });
    //     dispatch(
    //       setAlert({
    //         type: "success",
    //         text: "El vehiculo ha sido registrado correctamente.",
    //       })
    //     );
    //   } catch (e) {
    //     dispatch(
    //       setAlert({
    //         type: "error",
    //         text: findError(e),
    //       })
    //     );
    //   }
    // }
  };

  useEffect(() => {
    if (optionCustomer.data) {
      setCustomers(optionCustomer?.data?.getCustomer);
    }
    if (optionDevice.data) {
      setDevices(optionDevice?.data?.getDevices);
    }
    if (optionBilling.data) {
      setBillings(optionBilling?.data?.getBillings);
    }
    if (customers[0]?.name) {
      setCustomer({
        ...customer,
        name: vehicleForm.id ? vehicle?.customer.name : customers[0]?.name,
        lastName: vehicleForm.id
          ? vehicle?.customer.lastName
          : customers[0]?.lastName,
        username: vehicleForm.id
          ? vehicle?.customer.username
          : customers[0]?.username,
        password: vehicleForm.id
          ? vehicle?.customer.password
          : customers[0]?.password,
      });
      setDevice({
        ...device,
        name: vehicleForm.id ? vehicle?.device.name : devices[0]?.name,
      });
      setBilling({
        ...billing,
        name: vehicleForm.id ? vehicle?.billing.name : billings[0]?.name,
      });
      setVehicleForm({
        ...vehicleForm,
        customer: vehicleForm.id ? vehicle?.customer.id : customers[0]?.id,
        device: vehicleForm.id ? vehicle?.device.name : devices[0]?.name,
        billing: vehicleForm.id ? vehicle?.billing.name : billings[0]?.name,
        platform: vehicleForm.id ? vehicle!.platform : "PREMIUM",
        sim: vehicleForm.id ? vehicle!.sim : "MOVISTAR",
      });
    }
  }, [
    optionCustomer.data,
    optionDevice.data,
    optionBilling.data,
    customers[0]?.name,
    devices[0]?.name,
    billings[0]?.name,
  ]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Autocomplete
              id="idCustomer"
              value={{
                name: customer?.name,
                lastName: customer?.lastName,
                document: customer?.document,
                numDocument: customer?.numDocument,
                cellphone_1: customer?.cellphone_1,
                username: customer?.username,
                password: customer?.password,
              }}
              onChange={(event, value) => {
                setCustomer({
                  ...customer,
                  name: value ? value!.name : customers[0]?.name,
                  lastName: value ? value!.lastName : customers[0]?.lastName,
                  username: value ? value!.username : customers[0]?.username,
                  password: value ? value!.password : customers[0]?.password,
                });

                setVehicleForm({
                  ...vehicleForm,
                  customer: value ? `${value!.id}` : `${customers[0]?.id}`,
                });
              }}
              options={customers}
              getOptionLabel={(customer) =>
                customer.name ? `${customer.name} ${customer.lastName}` : ""
              }
              getOptionSelected={(option, value) => {
                if (value.name) {
                  return (
                    `${option.name} ${option.lastName}` ===
                    `${value.name} ${value.lastName}`
                  );
                }
                value = {
                  ...value,
                  name: customers[0]?.name,
                  lastName: customers[0]?.lastName,
                };
                return (
                  `${option.name} ${option.lastName}` ===
                  `${value.name} ${value.lastName}`
                );
              }}
              loading={optionCustomer.loading}
              loadingText="Cargando..."
              noOptionsText="No hay resultados"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="customer"
                  label="Cliente"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="idDevice"
              value={{
                name: device?.name,
              }}
              onChange={(event, value) => {
                setDevice({
                  ...device,
                  name: value ? value!.name : devices[0]?.name,
                });

                setVehicleForm({
                  ...vehicleForm,
                  device: value ? `${value!.name}` : `${devices[0]?.name}`,
                });
              }}
              options={devices}
              getOptionLabel={(device) => (device.name ? device.name : "")}
              getOptionSelected={(option, value) => {
                if (value.name) {
                  return option.name === value.name;
                }
                value = {
                  ...value,
                  name: devices[0]?.name,
                };
                return option.name === value.name;
              }}
              loading={optionDevice.loading}
              loadingText="Cargando..."
              noOptionsText="No hay resultados"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="device"
                  label="Dispositivo"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              id="idBilling"
              value={{
                name: billing?.name,
              }}
              onChange={(event, value) => {
                setBilling({
                  ...billing,
                  name: value ? value!.name : billings[0]?.name,
                });

                setVehicleForm({
                  ...vehicleForm,
                  billing: value ? `${value!.name}` : `${billings[0]?.name}`,
                });
              }}
              options={billings}
              getOptionLabel={(billing) => (billing.name ? billing.name : "")}
              getOptionSelected={(option, value) => {
                if (value.name) {
                  return option.name === value.name;
                }
                value = {
                  ...value,
                  name: billings[0]?.name,
                };
                return option.name === value.name;
              }}
              loading={optionBilling.loading}
              loadingText="Cargando..."
              noOptionsText="No hay resultados"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="billing"
                  label="Plan de facturación"
                  variant="outlined"
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="idPlatform"
              select
              label="Plataforma"
              fullWidth
              value={vehicleForm.platform}
              onChange={handleChange}
              name="platform"
              //helperText="Please select your currency"
              variant="outlined"
            >
              <MenuItem value="PREMIUM">PREMIUM</MenuItem>
              <MenuItem value="STANDAR">STANDAR</MenuItem>
              <MenuItem value="SIN PLATAFORMA">SIN PLATAFORMA</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="plate"
              autoComplete="off"
              id="idPlate"
              label="Placa"
              variant="filled"
              value={vehicleForm.plate}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="idChip"
              select
              label="Chip"
              fullWidth
              name="sim"
              value={vehicleForm.sim}
              onChange={handleChange}
              variant="outlined"
            >
              <MenuItem value="CLARO">CLARO</MenuItem>
              <MenuItem value="MOVISTAR">MOVISTAR</MenuItem>
              <MenuItem value="INKACEL">INKACEL</MenuItem>
              <MenuItem value="MULTIOPERADOR">MULTIOPERADOR</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="nroGPS"
              autoComplete="off"
              id="idNro"
              label="Nro de GPS"
              variant="filled"
              value={vehicleForm.nroGPS}
            />
          </Grid>
          <Grid item xs={12}>
            <RedditTextField
              fullWidth
              type="date"
              onChange={handleInput}
              name="billigStart"
              autoComplete="off"
              id="idBilligStart"
              label="Fecha de inicio"
              variant="filled"
              value={vehicleForm.billigStart}
            />
          </Grid>
          <DialogActions style={{ width: "100%" }}>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            {vehicleForm.id ? (
              optionsUpdate.loading ? (
                <Progress />
              ) : (
                <Button
                  type="submit"
                  color="primary"
                  autoFocus
                  variant="contained"
                >
                  Actualizar
                </Button>
              )
            ) : optionsCreate.loading ? (
              <Progress />
            ) : (
              <Button
                type="submit"
                color="primary"
                autoFocus
                variant="contained"
              >
                Registrar
              </Button>
            )}
          </DialogActions>
        </Grid>
      </form>
    </>
  );
};

export default VehicleForm;
