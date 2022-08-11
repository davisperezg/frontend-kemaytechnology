import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import VehicleList from "../components/vehicle/vehicle-list";
import { Vehicle } from "../interfaces/vehicle.interface";
import { useGetVehicles } from "../hooks/vehicle/useGetVehicle";
import VehicleForm from "../components/vehicle/VehicleForm";
import { findError } from "../helpers/control-errors";
import {
  useState,
  useEffect,
  ChangeEvent,
  MouseEvent,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import {
  ColumnDef,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Header,
  PaginationState,
  createColumnHelper,
  AccessorFn,
  DisplayColumnDef,
  IdentifiedColumnDef,
} from "@tanstack/react-table";
import TableContainer from "../components/table/TableContainer";
import "../components/table/table.css";
import { Customer } from "../interfaces/customer.interface";
import { Device } from "../interfaces/device.interface";
import { Billing } from "../interfaces/billing.interface";
import "./css/vehicle.css";
import { InputChange } from "../lib/types";
import SearchTable from "../components/table/search/SearchTable";

let contVencidosGlobal = 0;
let contXVencerGlobal = 0;
let contActivosGlobal = 0;

interface Person {
  firstName: string;
  lastName: string;
  age: number;
}

const datax: Vehicle[] = [
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA PEREZ",
      name: "DAVIS OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
  {
    billigEnd: new Date(),
    billigStart: new Date(),
    billing: {
      id: "6110df5dd210dfccd3152f21",
      name: "PLAN ANUAL",
      day: 365,
    },
    createdAt: new Date(),
    customer: {
      cellphone_1: "931432440",
      cellphone_2: "",
      document: "DNI",
      id: "6116b2dc81a2e01024da1427",
      lastName: "LAGUNA RAMIREZ",
      name: "NAUFTUHIM OBAL",
      numDocument: "40681485",
      password: "nastuin",
      username: "nastuin",
    },
    device: {
      id: "6110dfbad210dfccd3152f23",
      name: "TELTONIKA FMB920",
    },
    id: "6116b38981a2e01024da1428",
    nroGPS: "8934076400005364354",
    plate: "H1V279",
    platform: "PREMIUM",
    sim: "MULTIOPERADOR",
    updatedAt: new Date(),
  },
];

const columnHelper = createColumnHelper<Vehicle>();

const defaultColumns = [
  columnHelper.display({
    id: "index",
    cell: (props) => Number(props.row.id) + 1,
    header: () => "#",
    classNameHeader: "div text-center",
    classNameBody: "div-row text-center",
    size: 28,
    minSize: 28,
  } as DisplayColumnDef<Vehicle, unknown>),
  columnHelper.accessor(
    (row) =>
      `${(row.customer as Customer).name} ${
        (row.customer as Customer).lastName
      }`,
    {
      id: "customer",
      cell: (info) => info.getValue(),
      classNameBody: "div-row",
      header: () => "Cliente",
      classNameHeader: "div",
      size: 100,
      minSize: 31,
    } as DisplayColumnDef<Vehicle, string>
  ),
  columnHelper.accessor(
    (row) =>
      `${(row.customer as Customer).cellphone_1} ${
        (row.customer as Customer).cellphone_2
      } ${(row.customer as Customer).direction}`,
    {
      id: "info",
      cell: (info) => info.getValue(),
      classNameBody: "div-row",
      header: () => "Información",
      classNameHeader: "div",
      size: 100,
      minSize: 31,
    } as DisplayColumnDef<Vehicle, string>
  ),
  columnHelper.accessor((row) => `${(row.device as Device).name}`, {
    id: "device",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Dispositivo",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Vehicle, string>),
  columnHelper.accessor("platform", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Plataforma",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor((row) => `${(row.billing as Billing).name}`, {
    id: "billing",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Facturación",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Vehicle, string>),
  columnHelper.accessor("plate", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Placa",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("sim", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("nroGPS", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Nro de chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("billigStart", {
    cell: (info) => String(info.getValue()),
    classNameBody: "div-row",
    header: () => "Nro de chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.accessor("billigEnd", {
    cell: (info) => String(info.getValue()),
    classNameBody: "div-row",
    header: () => "Nro de chip",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Vehicle, string>),
  columnHelper.display({
    id: "actions",
    cell: (props) => "",
    header: () => "...",
    classNameHeader: "div text-center",
    size: 28,
    minSize: 28,
    enableResizing: false,
    enableSorting: false,
  } as DisplayColumnDef<Vehicle, unknown>),
];

const VehiclesPage = () => {
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<any[]>(datax);
  const [contVencidos, setContVencidos] = useState<number>(0);
  const [contActivos, setContActivos] = useState<number>(0);
  const [contPorVencer, setContXVencer] = useState<number>(0);
  const { data, isLoading, isError, isFetching } = useGetVehicles();

  const [search, setSearch] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const searchComponent = useRef<HTMLInputElement>(null);

  const buscarCantVehiculosXtipo = (array: Vehicle[]) => {
    setContVencidos(0);
    setContXVencer(0);
    setContActivos(0);
    contVencidosGlobal = 0;
    contXVencerGlobal = 0;
    contActivosGlobal = 0;

    const hoy = new Date().getTime();
    for (let index = 0; index < array.length; index++) {
      const vehicle = array[index];
      const fechaFin = vehicle.billigEnd
        ? new Date(vehicle.billigEnd).getTime()
        : new Date().getTime();
      const diff = fechaFin - hoy;
      const calcDiff = diff / (1000 * 60 * 60 * 24);
      if (hoy > fechaFin) {
        contVencidosGlobal++;
        setContVencidos(contVencidosGlobal);
      } else if (calcDiff <= 10) {
        contXVencerGlobal++;
        setContXVencer(contXVencerGlobal);
      } else {
        contActivosGlobal++;
        setContActivos(contActivosGlobal);
      }
    }
  };

  const memoVehicles = useMemo(() => {
    let arrayVehicles = datax;

    if (search !== "") {
      const data = arrayVehicles
        .map((v) => {
          return {
            ...v,
            customerFullname:
              (v.customer as Customer).name +
              " " +
              (v.customer as Customer).lastName,
          };
        })
        .filter(
          (vv) =>
            vv.customerFullname
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            vv.plate.toLowerCase().includes(search.trim().toLowerCase()) ||
            (vv.billing as Billing).name
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            vv.nroGPS.toLowerCase().includes(search.trim().toLowerCase()) ||
            vv.platform.toLowerCase().includes(search.trim().toLowerCase())
        );

      arrayVehicles = data.map((x) => ({
        ...x,
        customer: {
          ...(x.customer as Customer),
          name: (x.customer as Customer).name,
          lastName: (x.customer as Customer).lastName,
        },
      }));
    }

    return arrayVehicles;
  }, [search]);

  const handleSearch = (e: InputChange) => {
    const value: string = (
      searchComponent.current?.value as string
    ).toUpperCase();
    setSearch(value);
  };

  const handleOpenModalForm = () => setOpenModal(true);
  const handleCloseModalForm = () => setOpenModal(false);

  useLayoutEffect(() => {
    if (searchComponent.current) {
      searchComponent.current.focus();
    }
  }, []);

  return (
    <>
      {/* <DialogForm
        open={dialog.active}
        title={`${dialog.name} Vehiculo`}
        component={component(dialog.name)}
        handleClose={handleClose}
      /> */}
      <VehicleForm open={openModal} handleClose={handleCloseModalForm} />

      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "200px" }}>
          <Button
            onClick={handleOpenModalForm}
            variant="contained"
            color="primary"
            size="small"
            endIcon={<AddRoundedIcon />}
          >
            Crear vehiculo
          </Button>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label>Vehiculos activos</label>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#5bc959",
              marginLeft: 3,
              marginRight: 3,
            }}
          />
          <strong>{contActivos}</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginLeft: 20 }}>
          <label>Vehiculos por vencer</label>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#f7e160",
              marginLeft: 3,
              marginRight: 3,
            }}
          />
          <strong>{contPorVencer}</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginLeft: 20 }}>
          <label>Vehiculos vencidos</label>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#fc553f",
              marginLeft: 3,
              marginRight: 3,
            }}
          />
          <strong>{contVencidos}</strong>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          marginBottom: 10,
          width: "100%",
          display: "flex",
        }}
      >
        {/* documentacion https://www.npmjs.com/package/material-ui-search-bar */}
        <SearchTable
          handleSearch={handleSearch}
          searchComponent={searchComponent}
          placeholder="Buscar cliente, placa, plan de facturación, tipo de plataforma o nro de gps..."
        />
        {/* <SearchBar
          style={{ width: "100%" }}
          placeholder="Puede buscar por nombres, apellidos, placa, plan de facturación, tipo de plataforma o nro de gps"
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        /> */}
      </div>
      <TableContainer data={memoVehicles} columns={defaultColumns} />
      {/* <TableContainer
        component={Paper}
        style={{ whiteSpace: "nowrap", marginTop: 10 }}
      >
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Dispositivo</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Chip</TableCell>
              <TableCell>Nro GPS</TableCell>
              <TableCell>Fecha de Inicio</TableCell>
              <TableCell>Fecha de Termino</TableCell>
              <TableCell>Registrado por</TableCell>
              <TableCell>Actualizado por</TableCell>
              <TableCell>Fecha Creada</TableCell>
              <TableCell>Fecha Modificada</TableCell>
              <TableCell align="right">Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? vehicles.slice(
                  pagex * rowsPerPage,
                  pagex * rowsPerPage + rowsPerPage
                )
              : vehicles
            ).map((vehicle) => (
              <VehicleList key={vehicle.id} vehicle={vehicle} />
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </>
  );
};

export default VehiclesPage;
