import { Row } from "@tanstack/react-table";
import { Vehicle } from "../../interfaces/vehicle.interface";

interface Props {
  row: Row<Vehicle>;
}

const VehicleStatus = ({ row }: Props) => {
  const { original } = row;

  const calcDates = () => {
    const colorsError = ["#e74c3c", "#07bc0c", "#f1c40f"];
    //si la fecha de vencimiento y hoy supera los 7 dias => esta activo
    if (original.status === "ACTIVO") {
      return colorsError[1];
    }
    //si la fecha de vencimiento y hoy esta en el rango de 0-7 dias => esta por vencer
    if (original.status === "POR VENCER") {
      return colorsError[2];
    }
    //si la fecha de vencimiento y hoy es menor a 0 => esta vencido
    if (original.status === "VENCIDO") {
      return colorsError[0];
    }
  };

  return <div style={{ background: calcDates(), width: 25, height: 25 }}></div>;
};

export default VehicleStatus;
