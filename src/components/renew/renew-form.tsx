import { Vehicle } from "../../interfaces/vehicle.interface";
import { Button, DialogActions, Divider } from "@material-ui/core";
import { useCreateRenew } from "../../hooks/renew/useCreateRenew";
import { Renew } from "../../interfaces/renewinterface";
import { useState, useEffect } from "react";
import moment from "moment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { startOfDay, add } from "date-fns";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { Billing } from "../../interfaces/billing.interface";
import { useGetBilling } from "../../hooks/billing/useGetBilling";
import { SelectChange } from "../../lib/types";
import { useBillingByName } from "../../hooks/billing/useGetBillingByName";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { findError } from "../../helpers/control-errors";
import Progress from "../progress/progress";

import { logo } from "../../helpers/images_data64/data64";
import { ArrowLeft } from "@material-ui/icons";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Options {
  handleClose: () => void;
  vehicle: Vehicle;
}

const RenewForm = ({ handleClose, vehicle }: Options) => {
  const [isActive, setActive] = useState<boolean>(false);
  const [billings, setBillings] = useState<Billing[]>([]);
  const dispatch = useDispatch();
  const [renew, setRenew] = useState<Renew>({
    vehicle: vehicle.plate,
    billing: vehicle.billing.name,
  });

  const [state, setState] = useState({
    day: vehicle.billing.day,
  });

  const optionsBillings = useGetBilling();
  const optionBilling = useBillingByName();
  const optionsCreate = useCreateRenew();

  const today = startOfDay(new Date());
  const newDate = add(today, { days: state.day });

  const getBilling = async (name: string) => {
    try {
      await optionBilling.getBillingByName({
        variables: {
          name: name,
        },
      });
    } catch (e) {
      dispatch(
        setAlert({
          type: "error",
          text: findError(e),
        })
      );
    }
  };

  const handleChange = (event: SelectChange) => {
    setRenew({ ...renew, billing: event.target.value });
  };

  const registerRenew = async () => {
    // try {
    //   await optionsCreate.registerRenew({
    //     variables: {
    //       renewInput: renew,
    //     },
    //   });
    //   dispatch(
    //     setAlert({
    //       type: "success",
    //       text: "Se ha renovado correctamente.",
    //     })
    //   );
    // } catch (e) {
    //   dispatch(
    //     setAlert({
    //       type: "error",
    //       text: findError(e),
    //     })
    //   );
    // }
    //TODO:  GENERACION DE PDF RENOVACION
    const doc = new jsPDF();
    const left = 10;
    const titulo ="RENOVACION DE INSCRIPCIÓN";
    const nom = "Nombre:   "+ vehicle.customer.name + " " + vehicle.customer.lastName;
    const dni = "N°.DNI :  "+vehicle.customer.numDocument;
    const fechaEmi = "Fecha de emisión :  "+moment(
      vehicle.billigStart
    ).format("DD/MM/YYYY");
    const firma ="Kemay Tecnology E.I.R.L"; 
    const ruc = "RUC:12345678";
    doc.rect(10, 10, 190, 130);
    doc.rect(50, 15, 140, 20)
    //TODO:Contenido de la tabla
    doc.addImage(logo, "JPG", left +3, 15, 35, 30);
    doc.line(100,125,190,125)
    doc.setFontSize(13);
    doc.setFont("Bahnschrift", "bold");
    doc.text(titulo,80, 20);
    doc.setFontSize(10);
    doc.setFont("Bahnschrift", "bold");
    doc.text(nom,55,25);
    doc.text(dni,130,25);
    doc.text(fechaEmi,55,30);
    doc.text(firma,125, 130);
    doc.text(ruc,130, 135);
    //TODO:Tabla
    autoTable(doc, {
      margin:{ top: 50 },
      head: [['N°.GPS', 'Descripción', 'Plan','Placa','Fecha.I','Fecha.F','Precio']],
      body: [
        [vehicle.nroGPS, 'Renovacion ',vehicle!.platform,vehicle.plate,moment(
          vehicle.billigStart
        ).format("DD/MM/YYYY"),moment(vehicle.billigEnd).format("DD/MM/YYYY"),'S/.'],
      
      ],
    })
  
    doc.save(`Comprobante Renovación`);
  };

  useEffect(() => {
    if (optionsBillings.data) {
      setBillings(optionsBillings.data.getBillings);
    }
    if (optionBilling.data) {
      setState({ ...state, day: optionBilling.data.getBillingByName.day });
    }
  }, [optionsBillings.data, optionBilling.data]);

  return (
    <>
      <p>
        Estas apunto de renovar su inscripción del vehiculo{" "}
        <strong>{vehicle.plate}</strong> que pertenece a{" "}
        <strong>
          {vehicle.customer.name} {vehicle.customer.lastName}
        </strong>{" "}
        con número de <strong>{vehicle.customer.document}</strong>,{" "}
        <strong>{vehicle.customer.numDocument}</strong>.
      </p>
      <br />
      <Divider />
      <br />
      {isActive ? (
        <FormControl variant="outlined" style={{ width: 300 }}>
          <InputLabel id="idBilling-label">Plan de facturación</InputLabel>
          <Select
            labelId="idBilling-label"
            id="idBilling"
            value={renew.billing}
            onChange={handleChange}
            label="Age"
          >
            {billings.map((billing) => (
              <MenuItem key={billing.id} value={billing.name}>
                {billing.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <>
          <label>
            {renew.billing !== vehicle.billing.name ? (
              <label style={{ background: "yellow" }}>Cambiado a</label>
            ) : (
              "Actualmente tiene"
            )}
          </label>{" "}
          {renew.billing}
        </>
      )}{" "}
      <Tooltip
        title="Editar plan de facturación"
        onClick={() => {
          setActive(!isActive);
          getBilling(renew.billing);
        }}
      >
        <IconButton aria-label="vehicle" size="small" style={{ color: "blue" }}>
          {isActive ? "Guardar" : "Editar"}
          {isActive ? <SaveRoundedIcon /> : <EditRoundedIcon />}
        </IconButton>
      </Tooltip>
      <br />
      <br />
      <div style={{ width: "100%", height: "auto" }}>
        <div style={{ width: "50%", float: "left" }}>
          <label>Fecha de caducidad</label>{" "}
        </div>
        <div style={{ width: "50%", float: "left" }}>
          {moment(vehicle.billigEnd).format("DD/MM/YYYY")}
        </div>
      </div>
      <br />
      <br />
      <Divider />
      <br />
      <div
        style={{
          filter: isActive ? "blur(4px)" : "blur(0)",
          userSelect: isActive ? "none" : "text",
        }}
      >
        <div style={{ width: "100%", height: "auto" }}>
          <div style={{ width: "50%", float: "left", backgroundColor: "#fff" }}>
            Renueva desde
          </div>
          <div style={{ width: "50%", float: "left" }}>
            {moment().format("DD/MM/YYYY")}
          </div>
        </div>
        <div style={{ width: "100%", height: "auto" }}>
          <div style={{ width: "50%", float: "left", backgroundColor: "#fff" }}>
            &nbsp;
          </div>
          <div style={{ width: "50%", float: "left" }}>
            <strong>+</strong> {state.day} días
          </div>
        </div>
        <div style={{ width: "100%", height: "auto" }}>
          <div style={{ width: "50%", float: "left", backgroundColor: "#fff" }}>
            Renovando hasta
          </div>
          <div style={{ width: "50%", float: "left" }}>
            {moment(newDate).format("DD/MM/YYYY")}
          </div>
        </div>
      </div>
      <DialogActions style={{ width: "100%" }}>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        {optionsCreate.loading ? (
          <Progress />
        ) : (
          <Button
            onClick={registerRenew}
            color="primary"
            autoFocus
            disabled={isActive ? true : false}
            variant="contained"
          >
            Aceptar
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default RenewForm;
