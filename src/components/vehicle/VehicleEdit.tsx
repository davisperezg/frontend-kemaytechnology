import { useEffect, useMemo, useState } from "react";
import { IModal } from "../../interfaces/modal.interface";
import * as Yup from "yup";
import { useGetBilling } from "../../hooks/billing/useGetBilling";
import { useGetDevices } from "../../hooks/device/useGetDevice";
import { useGetCustomers } from "../../hooks/customer/useGetCustomer";
import { Device } from "../../interfaces/device.interface";
import { Billing } from "../../interfaces/billing.interface";
import { Customer } from "../../interfaces/customer.interface";
import { MyDialogMUI, MyDialogTitleMUI } from "../dialog/DialogV2";
import TabContainer from "../Tab/TabContainer";
import TabElement from "../Tab/TabElement";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogProps,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import TabItem from "../Tab/TabItem";
import { useUpdateVehicle } from "../../hooks/vehicle/useUpdateVehicle";
import "./vehicle.css";
import {
  differenceInDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  getDate,
  isAfter,
  isBefore,
  monthsToYears,
} from "date-fns";
import { useGetOneRenew } from "../../hooks/renew/useGetRenewById";
import VehicleTimeDefeated from "./VehicleTimeDefeated";
import { useCreateRenew } from "../../hooks/renew/useCreateRenew";
import { allMonthsLocal } from "../../lib/const";
import { errorCatch } from "../../helpers/control-errors";
import { useGetOneRenewPlate } from "../../hooks/renew/useGetRenewByVehicle";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { useToCheck } from "../../hooks/renew/useCheckRenew";

interface IOptions {
  label: string;
  value: string;
}

const GET = (val: string) => {
  return {
    day: format(new Date(String(val)), "dd"),
    month: format(new Date(String(val)), "MMMM"),
    year: format(new Date(String(val)), "yyyy"),
  };
};

const validationSchema = Yup.object().shape({
  customer: Yup.string().required("Por favor seleccione al cliente"),
  device: Yup.string().required("Por favor seleccione el dispositivo"),
  billing: Yup.string().required("Por favor seleccione el plan de facturación"),
  plate: Yup.string().required("Por favor ingrese la placa"),
  nroGPS: Yup.string()
    .required("Por favor ingrese el nro de GPS")
    .min(9, "Minimo debe contener 9 caracteres")
    .max(9, "Maximo debe contener 9 caracteres"),
  platform: Yup.string().required(
    "Por favor ingrese a que plataforma ira el GPS"
  ),
  sim: Yup.string().required(
    "Por favor ingrese a que compañia pertenece el sim del GPS"
  ),
  // billingDes: Yup.string().required(
  //   "Por favor complete alguna descripción. Luego presione su conformidad."
  // ),
});

const VehicleEdit = ({ open, handleClose, entity }: IModal) => {
  const [value, setValue] = useState<IOptions | null>({
    label: entity.customer.name + " " + entity.customer.lastName,
    value: entity.customer.id,
  });
  const [inputValue, setInputValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  //DEVICE
  const [valueDevice, setValueDevice] = useState<IOptions | null>({
    label: entity.device.name,
    value: entity.device.id,
  });
  const [inputValueDevice, setInputValueDevice] = useState("");
  const [customValueDevice, setCustomValueDevice] = useState("");
  //BILLING
  const [valueBilling, setValueBilling] = useState<IOptions | null>({
    label: entity.billing.name,
    value: entity.billing.id,
  });
  const [inputValueBilling, setInputValueBilling] = useState("");
  const [customValueBilling, setCustomValueBilling] = useState("");

  const [valueTab, setValueTab] = useState("1");
  const { data, isLoading, isError, isFetching } = useGetCustomers();
  const {
    data: dataDevices,
    isLoading: isLoadingDevices,
    isError: isErrorDevices,
    isFetching: isFetchingDevices,
  } = useGetDevices();
  const {
    data: dataBillings,
    isLoading: isLoadingBillings,
    isError: isErrorBillings,
    isFetching: isFetchingBillings,
  } = useGetBilling();
  const [errorLocal, setErrorLocal] = useState<[]>([]);
  const { mutateAsync, isLoading: isLoadingCreateVehicle } = useUpdateVehicle();
  const { mutateAsync: mutateAsyncRenew, isLoading: isLoadingCreateRenew } =
    useCreateRenew();
  const { mutateAsync: mutateAsyncToCheck, isLoading: isLoadingToCheck } =
    useToCheck();
  const {
    data: dataRenew,
    isLoading: isLoadingRenew,
    isError: isErrorRenew,
    error: errorRenew,
  } = useGetOneRenewPlate(entity.plate);
  const [time, setTime] = useState<
    {
      year: { name: ""; state: false };
      months: { name: ""; state: false }[];
    }[]
  >([]);
  const [clickedTime, setClickedTime] = useState<boolean>(false);
  const [errorDes, setErrorDes] = useState({
    state: false,
    message: "",
  });

  const [dataYearInActives, setDataYearInActives] = useState<any[]>([]);
  const [payInit, setPayInit] = useState<string>("");
  const [withDialog, setWidthDialog] = useState<DialogProps["maxWidth"]>("sm");
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [details, setDetails] = useState<any>({});

  const onClickRemove = async (entity: any) => {
    const { id, index } = entity;

    const myalert = window.confirm(
      `¿Esta seguro que desea solicitar la baja de la renovación NRO ${index}?`
    );
    if (myalert) {
      try {
        await mutateAsyncToCheck({
          variables: {
            renewInput: {
              id: id,
            },
          },
        });
      } catch (e) {
        const [desErrors] = errorCatch(e);
        setErrorLocal(desErrors);
        toast.error(
          desErrors
            .map((e: any, i: number) => {
              return `${i + 1}.- ${e}`;
            })
            .join("\n")
        );
      }
    }
  };

  const onClickDetails = (entity: any) => {
    setOpenSearch(true);
    setDetails(entity);
  };

  const memoCustomers: IOptions[] = useMemo(() => {
    let dataCustomers: any[] = [];

    if (data) {
      const customers = data.map((a: Customer) => {
        return {
          label: a.name + " " + a.lastName,
          value: a.id,
        };
      });

      dataCustomers = [...customers];
    }

    return dataCustomers;
  }, [data]);

  const memoDevices: IOptions[] = useMemo(() => {
    let myDevices: any[] = [];

    if (dataDevices) {
      const devices = dataDevices.map((a: Device) => {
        return {
          label: a.name,
          value: a.id,
        };
      });

      myDevices = [...devices];
    }

    return myDevices;
  }, [dataDevices]);

  const memoBillings: IOptions[] = useMemo(() => {
    let myBillings: any[] = [];

    if (dataBillings) {
      const billings = dataBillings.map((a: Billing) => {
        return {
          label: a.name,
          value: a.id,
          day: a.day,
          price: a.price,
        };
      });

      myBillings = [...billings];
    }

    return myBillings;
  }, [dataBillings]);

  const handleChangeTab = (newValue: string) => {
    setValueTab(newValue);
  };

  const calcDates = () => {
    const billingEnd = new Date(String(entity.billigEnd));
    const colorsError = ["VENCIDO", "ACTIVO", "POR VENCER"];
    const diffDays = differenceInDays(billingEnd, new Date());
    //si la fecha de vencimiento y hoy supera los 7 dias => esta activo
    if (diffDays > 7) {
      return colorsError[1];
    }
    //si la fecha de vencimiento y hoy esta en el rango de 0-7 dias => esta por vencer
    else if (diffDays <= 7 && diffDays >= 0) {
      return colorsError[2];
    }
    //si la fecha de vencimiento y hoy es menor a 0 => esta vencido
    else {
      return colorsError[0];
    }
  };

  const getDayEnd = format(new Date(entity.billigEnd), "dd");

  const daysIntervals = useMemo(() => {
    if (isAfter(new Date(entity.billigEnd), new Date())) {
      return {
        time_total: "",
        dates_expired: [],
      };
    }

    let cant = 0;
    let index = 0;
    let arrayExpired: any[] = [];

    const instervals = eachDayOfInterval({
      start: new Date(entity.billigEnd),
      end: new Date(),
    }).map((a) => {
      return {
        date: format(a, "dd/MM/yyyy"),
        day: format(a, "dd"),
        month: format(a, "MMMM"),
        year: format(a, "yyyy"),
        month_year: format(a, "MMMM/yyyy"),
      };
    });

    instervals.map((a, i) => {
      if (a.day === getDayEnd) {
        arrayExpired.push(a);
        cant++;
        index = i;
      }
    });

    const shortRestIntervals = instervals.slice(index + 1, instervals.length);
    const allYears = arrayExpired.map((a) => a.year);
    const setYearIntervals = new Set(allYears);
    const yearIntervals = Array.from(setYearIntervals);
    const monthArrayByYear = yearIntervals.map((a) => {
      return {
        year: a,
        months: arrayExpired.filter((b) => b.year === a).map((c) => c.month),
      };
    });

    const testYear = yearIntervals.map((a) => {
      return {
        year: {
          name: a,
          state: false,
          index: -1,
        },
        months: arrayExpired
          .filter((b) => b.year === a)
          .map((c) => {
            return {
              name: c.month,
              state: false,
            };
          }),
        isYearPast: yearIntervals.some((b) => Number(b) === Number(a) - 1),
        isFullActive: false,
      };
    });

    setDataYearInActives(testYear);

    return {
      time_total: `${monthsToYears(cant)} años, ${
        cant - monthsToYears(cant) * 12
      } meses, ${shortRestIntervals.length} dias.`,
      dates_expired: monthArrayByYear,
    };
  }, [entity.billigEnd, getDayEnd]);

  const clearErrorAnClicked = () => {
    setErrorDes({
      state: false,
      message: "",
    });
    setClickedTime(false);
  };

  const searchPositionMonth = (month: string) => allMonthsLocal.indexOf(month);

  useEffect(() => {
    if (dataYearInActives) {
      //isFullActive
      const getFinalPayed = dataYearInActives
        .filter((a: any) => a.year.state)
        .at(-1);

      if (getFinalPayed && getFinalPayed.year.state) {
        const getEndYearPayed = getFinalPayed.year;
        const getEndMonthPayed = getFinalPayed.months
          .filter((b: any) => b.state)
          .at(-1);
        const getMonthInNumber = searchPositionMonth(getEndMonthPayed.name);

        const getDayInit =
          getDate(new Date(String(entity.billigStart))) !==
          getDate(new Date(String(entity.billigEnd)))
            ? getDate(new Date(String(entity.billigEnd)))
            : getDate(new Date(String(entity.billigStart)));

        const datePayedInDate = new Date(
          Number(getEndYearPayed.name),
          Number(getMonthInNumber),
          Number(getDayInit)
        );

        const formatToDateInit = format(datePayedInDate, "dd/MM/yyyy");
        setPayInit(formatToDateInit);
        return;
      }

      setPayInit("");
    }
  }, [dataYearInActives, entity.billigStart, entity.billigEnd]);

  const isVehicleActive =
    differenceInDays(new Date(), new Date(String(entity.billigEnd))) <= 0;

  const rangeMonthPayed = (rangeA: string, rangeB: string) =>
    eachMonthOfInterval({
      start: new Date(String(rangeA)),
      end: new Date(String(rangeB)),
    }).map((a: any) => ({ year: format(a, "yyyy"), month: format(a, "MMMM") }));

  //ordena de manera descendente y trabaja con una copia. No ordena a la orginal
  const renews = useMemo(() => {
    let result = [];

    if (dataRenew) {
      result = dataRenew
        .map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) }))
        .slice()
        .sort((a: any, b: any) => b.createdAt - a.createdAt);
    }

    return result;
  }, [dataRenew]);

  return (
    <MyDialogMUI
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth={withDialog}
      //sx={{ maxHeight: 553 }}
    >
      <MyDialogTitleMUI id="scroll-dialog-title">
        Vehiculo - {entity.plate}
      </MyDialogTitleMUI>
      <TabContainer>
        <TabElement
          handleClick={() => {
            handleChangeTab("1");
            setWidthDialog("sm");
          }}
          value={valueTab}
          index={1}
        >
          General
        </TabElement>
        <TabElement
          handleClick={() => {
            handleChangeTab("2");
            setWidthDialog("sm");
          }}
          value={valueTab}
          index={2}
        >
          Renovar
        </TabElement>
        <TabElement
          handleClick={() => {
            handleChangeTab("3");
            setWidthDialog("xl");
          }}
          value={valueTab}
          index={3}
        >
          Historial
        </TabElement>
      </TabContainer>

      <DialogContent>
        <Formik
          initialValues={{
            id: entity.id,
            customer: entity.customer.id,
            device: entity.device.id,
            billing: entity.billing.id,
            plate: entity.plate,
            nroGPS: entity.nroGPS,
            platform: entity.platform,
            sim: entity.sim,
            retired: entity.retired,
            billingReno: entity.billing.id,
            billingDay: entity.billing.day,
            billingPrice: entity.billing.price,
            billingPayToday: isVehicleActive ? "" : "NO",
            billingDes: "",
            billingTime: [] as any[],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            if (clickedTime) {
              const monthsJustTrue = values.billingTime
                .filter((x: any) => x.year.state)
                .map((a: any) => {
                  return {
                    year: a.year.name,
                    months: a.months
                      .filter((b: any) => b.state)
                      .map((c: any) => c.name),
                  };
                });

              try {
                await mutateAsyncRenew({
                  variables: {
                    renewInput: {
                      vehicle: values.plate,
                      billing: values.billingReno,
                      billingPayToday: values.billingPayToday,
                      billingTime: monthsJustTrue,
                      billingDes: values.billingDes,
                    },
                  },
                });

                toast.success("El vehiculo se ha renovado con éxito");
              } catch (e: any) {
                const [desErrors] = errorCatch(e);
                setErrorLocal(desErrors);
                toast.error(
                  desErrors
                    .map((e: any, i: number) => {
                      return `${i + 1}.- ${e}`;
                    })
                    .join("\n")
                );
              }
            }
            try {
              await mutateAsync({
                variables: {
                  vehicleInput: {
                    id: values.id,
                    customer: values.customer,
                    device: values.device,
                    plate: values.plate,
                    nroGPS: values.nroGPS,
                    platform: values.platform,
                    sim: values.sim,
                    retired: values.retired,
                  },
                },
              });

              toast.success(
                "Se ha actualizado con éxito las propiedades GENERAL del vehiculo"
              );
            } catch (e: any) {
              const [desErrors] = errorCatch(e);
              setErrorLocal(desErrors);
              toast.error(
                desErrors
                  .map((e: any, i: number) => {
                    return `${i + 1}.- ${e}`;
                  })
                  .join("\n")
              );
            }

            handleClose();
          }}
        >
          {({
            errors,
            values,
            handleChange,
            handleBlur,
            touched,
            setValues,
          }) => {
            return (
              <Form>
                {errorLocal.length > 0 && (
                  <Grid item xs={12}>
                    {errorLocal.map((a: any, i: number) => {
                      return (
                        <div
                          key={i + 1}
                          style={{
                            background: "#D32F2F",
                            color: "#fff",
                            padding: 5,
                            fontSize: 12,
                          }}
                        >
                          {`${i + 1}.- ${a}`}
                        </div>
                      );
                    })}
                  </Grid>
                )}
                <TabItem value={valueTab} index={1}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Autocomplete
                        onBlur={handleBlur}
                        size="small"
                        id="customer"
                        options={memoCustomers}
                        loading={isLoading}
                        value={value}
                        isOptionEqualToValue={(options, value) => {
                          return options.value === value.value;
                        }}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                          setCustomValue(String(newValue?.value));
                          setValues({
                            ...values,
                            customer:
                              String(newValue?.value) === "undefined"
                                ? ""
                                : String(newValue?.value),
                          });
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        // sx={{ width: "100%" }}
                        renderOption={(params, option) => (
                          <li {...params}>
                            {isLoading ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <label>Cargando clientes...</label>
                                <CircularProgress color="inherit" size={20} />
                              </div>
                            ) : (
                              option?.label
                            )}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cliente"
                            error={
                              touched.customer && errors.customer ? true : false
                            }
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isFetching ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        noOptionsText="Sin registros"
                        openText="Abrir lista de clientes"
                        clearText="Limpiar cliente"
                        loadingText="Cargando lista..."
                        closeText="Cerrar lista de clientes"
                      />
                      {touched.customer && errors.customer && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="customer-error-text"
                        >
                          {errors.customer}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Autocomplete
                        id="device"
                        onBlur={handleBlur}
                        size="small"
                        options={memoDevices}
                        loading={isLoadingDevices}
                        value={valueDevice}
                        isOptionEqualToValue={(options, value) => {
                          return options.value === value.value;
                        }}
                        getOptionLabel={(option) => option.label}
                        onChange={(event, newValue) => {
                          setValueDevice(newValue);
                          setCustomValueDevice(String(newValue?.value));
                          setValues({
                            ...values,
                            device:
                              String(newValue?.value) === "undefined"
                                ? ""
                                : String(newValue?.value),
                          });
                        }}
                        inputValue={inputValueDevice}
                        onInputChange={(event, newInputValue) => {
                          setInputValueDevice(newInputValue);
                        }}
                        renderOption={(params, option) => (
                          <li {...params}>
                            {isLoadingDevices ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <label>Cargando dispositivos...</label>
                                <CircularProgress color="inherit" size={20} />
                              </div>
                            ) : (
                              option?.label
                            )}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Dispositivo"
                            error={
                              touched.device && errors.device ? true : false
                            }
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isFetchingDevices ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        noOptionsText="Sin registros"
                        openText="Abrir lista de dispositivos"
                        clearText="Limpiar dispositivo"
                        loadingText="Cargando lista..."
                        closeText="Cerrar lista de dispositivos"
                      />
                      {touched.device && errors.device && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="device-error-text"
                        >
                          {errors.device}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        size="small"
                        error={
                          touched.platform && errors.platform ? true : false
                        }
                      >
                        <InputLabel id="select-platform">Plataforma</InputLabel>
                        <Select
                          labelId="select-platform"
                          id="platform"
                          name="platform"
                          onBlur={handleBlur}
                          label="Plataforma"
                          value={values.platform}
                          onChange={handleChange}
                        >
                          <MenuItem value="PREMIUN">PREMIUN</MenuItem>
                          <MenuItem value="STANDAR">STANDAR</MenuItem>
                          <MenuItem value="SIN PLATAFORMA">
                            SIN PLATAFORMA
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {touched.platform && errors.platform && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="platform-error-text"
                        >
                          {errors.platform}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        size="small"
                        id="plate"
                        label="Placa"
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        value={values.plate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.plate && errors.plate ? true : false}
                      />
                      {touched.plate && errors.plate && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="plate-error-text"
                        >
                          {errors.plate}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="select-chip">Chip</InputLabel>
                        <Select
                          labelId="select-chip"
                          id="sim"
                          name="sim"
                          label="Chip"
                          value={values.sim}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.sim && errors.sim ? true : false}
                        >
                          <MenuItem value="MOVISTAR">MOVISTAR</MenuItem>
                          <MenuItem value="CLARO">CLARO</MenuItem>
                          <MenuItem value="ENTEL">ENTEL</MenuItem>
                          <MenuItem value="BITEL">BITEL</MenuItem>
                          <MenuItem value="INKACEL">INKACEL</MenuItem>
                          <MenuItem value="MULTIOPERADOR">
                            MULTIOPERADOR CESAR
                          </MenuItem>
                          <MenuItem value="MULTIOPERADOR_M2MCENTER">
                            MULTIOPERADOR M2M CENTER ORANGE
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {touched.sim && errors.sim && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="sim-error-text"
                        >
                          {errors.sim}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        size="small"
                        id="nroGPS"
                        label="Nro de GPS"
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        value={values.nroGPS}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.nroGPS && errors.nroGPS ? true : false}
                      />
                      {touched.nroGPS && errors.nroGPS && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="nroGPS-error-text"
                        >
                          {errors.nroGPS}
                        </FormHelperText>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <div className="content-check">
                        <label className="text-check">
                          Marca la casilla si el gps del cliente ha sido
                          retirado
                        </label>
                        <FormGroup style={{ float: "right" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                size="small"
                                id="retired"
                                checked={values.retired}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            }
                            label="Retirado"
                          />
                        </FormGroup>
                      </div>
                    </Grid>
                  </Grid>
                </TabItem>
                <TabItem value={valueTab} index={2}>
                  <>
                    <p>
                      Estas apunto de renovar la inscripción del vehiculo{" "}
                      <strong>{entity.plate}</strong> que pertenece a{" "}
                      <strong>{inputValue}</strong> con número de{" "}
                      <strong>{entity.customer.document}</strong>,{" "}
                      <strong>{entity.customer.numDocument}</strong>.
                    </p>
                    <table className="table-edit mt-div">
                      <tbody>
                        <tr>
                          <td className="td-edit" width={200}>
                            <strong>Actualmente tiene el plan</strong>
                          </td>
                          <td className="td-edit">
                            <select
                              id="billingReno"
                              name="billingReno"
                              onChange={(e) => {
                                const getDataBilling: any = memoBillings.find(
                                  (a) => {
                                    return a.value === e.target.value;
                                  }
                                );
                                setValues({
                                  ...values,
                                  billingDay: getDataBilling.day || "xDay",
                                  billingPrice:
                                    getDataBilling.price || "xPrice",
                                });
                                return handleChange(e);
                              }}
                              value={values.billingReno}
                            >
                              {memoBillings.map((a) => {
                                return (
                                  <option key={a.value} value={a.value}>
                                    {a.label}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td className="td-edit" width={200}>
                            <strong>El plan contiene</strong>
                          </td>
                          <td className="td-edit">
                            <label>{values.billingDay} días</label>
                          </td>
                        </tr>
                        <tr>
                          <td className="td-edit" width={200}>
                            <strong>Precio del plan actual</strong>
                          </td>
                          <td className="td-edit">
                            <label>
                              S/{" "}
                              {Number.isNaN(values.billingPrice)
                                ? "0.00"
                                : values.billingPrice}
                            </label>
                          </td>
                        </tr>

                        <tr>
                          <td className="td-edit" width={200}>
                            <strong>Precio del plan actual x día</strong>
                          </td>
                          <td className="td-edit">
                            <label>
                              S/{" "}
                              {Number.isNaN(
                                values.billingPrice / values.billingDay
                              )
                                ? "0.00"
                                : values.billingPrice / values.billingDay}
                            </label>
                          </td>
                        </tr>
                        <tr>
                          <td className="td-edit" width={200}>
                            <strong>Precio del plan actual x hora</strong>
                          </td>
                          <td className="td-edit">
                            <label>
                              S/{" "}
                              {Number.isNaN(
                                values.billingPrice / values.billingDay
                              )
                                ? "0.00"
                                : values.billingPrice / values.billingDay / 24}
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table className="table-edit mt-div">
                      <tbody>
                        <tr>
                          <td className="td-edit" width={200}>
                            <strong>Estado del vehiculo</strong>
                          </td>
                          <td className="td-edit">{calcDates()}</td>
                        </tr>
                        <tr>
                          <td className="td-edit" width={200}>
                            <strong>Periodo</strong>
                          </td>
                          <td className="td-edit">
                            {format(
                              new Date(String(entity.billigStart)),
                              "dd/MM/yyyy"
                            )}{" "}
                            hasta el{" "}
                            {format(
                              new Date(String(entity.billigEnd)),
                              "dd/MM/yyyy"
                            )}
                          </td>
                        </tr>
                        <tr>
                          {isVehicleActive ? (
                            <>
                              <td className="td-edit" width={200}>
                                <strong>Días restantes</strong>
                              </td>
                              <td className="td-edit">
                                <label style={{ color: "green" }}>
                                  {differenceInDays(
                                    new Date(String(entity.billigEnd)),
                                    new Date()
                                  ) === 0
                                    ? "Se vence en las próximas 24hrs..."
                                    : differenceInDays(
                                        new Date(String(entity.billigEnd)),
                                        new Date()
                                      )}
                                </label>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="td-edit" width={200}>
                                <strong>Tiempo vencido</strong>
                              </td>
                              <td className="td-edit">
                                <>
                                  {dataYearInActives.map((row, i) => {
                                    return (
                                      <VehicleTimeDefeated
                                        key={i + 1}
                                        id={i}
                                        activeYears={dataYearInActives}
                                        entity={row}
                                        setTime={setTime}
                                        time={time}
                                        setDataYearInActives={
                                          setDataYearInActives
                                        }
                                        clearErrorAnClicked={
                                          clearErrorAnClicked
                                        }
                                      />
                                    );
                                  })}
                                  <div className="line" />
                                  <div className="content-tvm-div">
                                    <div className="tv-item">Tiempo total</div>
                                    <div className="result-tv-item">
                                      <label style={{ color: "red" }}>
                                        {daysIntervals.time_total}
                                      </label>
                                    </div>
                                  </div>
                                </>
                              </td>
                            </>
                          )}
                        </tr>
                      </tbody>
                    </table>

                    {/* <fieldset className="mt-div fieldset_content">
                      <legend style={{ paddingRight: 5 }}>
                        Opciones solo para planes mensuales
                      </legend> */}
                    {!isVehicleActive && values.billingPayToday === "NO" && (
                      <div className="mt-div">
                        <Alert severity="warning">
                          Los pagos iniciaran desde hoy día(
                          {format(new Date(), "dd/MM/yyyy")})
                        </Alert>
                      </div>
                    )}
                    {!isVehicleActive && (
                      <table className="table-edit mt-div">
                        <tbody>
                          <tr>
                            <td className="td-edit" width={200}>
                              <strong>
                                El pago inicia el día{" "}
                                {payInit === ""
                                  ? "(Por favor seleccione un mes a pagar)"
                                  : payInit}
                                ?
                              </strong>
                            </td>
                            <td className="td-edit">
                              <>
                                <div className="content-inputCheck">
                                  <Field
                                    className="input-radio"
                                    type="radio"
                                    id="today_yes"
                                    name="billingPayToday"
                                    onChange={(e: any) => {
                                      clearErrorAnClicked();
                                      return handleChange(e);
                                    }}
                                    value="SI"
                                  />{" "}
                                  <label htmlFor="today_yes">Si</label>
                                </div>
                                <div className="content-inputCheck">
                                  <Field
                                    className="input-radio"
                                    type="radio"
                                    id="today_no"
                                    name="billingPayToday"
                                    onChange={(e: any) => {
                                      clearErrorAnClicked();
                                      return handleChange(e);
                                    }}
                                    value="NO"
                                  />{" "}
                                  <label htmlFor="today_no">No</label>
                                </div>
                              </>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                    {/* </fieldset> */}
                    <div className="mt-div content-dscrp">
                      <div className="dscrp">
                        <label style={{ fontSize: 12 }}>
                          Escribe alguna descripción
                        </label>
                        <Field
                          as="textarea"
                          rows={5}
                          cols={5}
                          className="dscrp--textarea"
                          style={{
                            width: 250,
                            padding: 3,
                            border: errorDes.state ? "1px solid red" : "",
                          }}
                          placeholder="Escriba su mensaje..."
                          onChange={(e: any) => {
                            if (e.target.value.length > 0) {
                              setErrorDes({
                                state: false,
                                message: "",
                              });
                              setClickedTime(false);
                            } else {
                              setErrorDes({
                                state: true,
                                message:
                                  "Por favor complete alguna descripción. Luego presione su conformidad.",
                              });
                              setClickedTime(false);
                            }
                            return handleChange(e);
                          }}
                          value={values.billingDes}
                          name="billingDes"
                        />
                      </div>
                      <div
                        className={`${
                          errorDes.state || clickedTime
                            ? "btn-dscrp__confirm"
                            : "btn-dscrp"
                        }`}
                      >
                        {clickedTime ? (
                          <div
                            style={{ width: 200, fontSize: 5, float: "left" }}
                          >
                            <label style={{ fontSize: 12, fontWeight: 500 }}>
                              Se ha confirmado la renovación. Ya puede guardar
                              los cambios haciendo click en OK
                            </label>
                          </div>
                        ) : (
                          errorDes.state && (
                            <div
                              style={{ width: 200, fontSize: 5, float: "left" }}
                            >
                              <label
                                style={{
                                  fontSize: 12,
                                  fontWeight: 500,
                                  color: "red",
                                }}
                              >
                                {errorDes.message}
                              </label>
                            </div>
                          )
                        )}
                        <button
                          type="button"
                          className="mt-5"
                          style={{ float: "right" }}
                          onClick={() => {
                            if (!isVehicleActive) {
                              const isYearTrue = dataYearInActives.some(
                                (a: any) => a.year.state === true
                              );
                              const isMonthTrue = dataYearInActives.some(
                                (b: any) =>
                                  b.months.some((d: any) => d.state === true)
                              );

                              if (!isYearTrue && !isMonthTrue) {
                                alert(
                                  "No hemos podido confirmar su renovaciòn porque aun no ha seleccionado el mes que el cliente va a pagar."
                                );
                                clearErrorAnClicked();
                              } else {
                                if (
                                  isYearTrue &&
                                  isMonthTrue &&
                                  values.billingDes === ""
                                ) {
                                  setClickedTime(false);
                                  setErrorDes({
                                    state: true,
                                    message:
                                      "Por favor complete alguna descripción. Luego presione su conformidad.",
                                  });
                                } else {
                                  //todo ok
                                  setClickedTime(true);
                                  setErrorDes({
                                    state: false,
                                    message: "",
                                  });
                                  setValues({
                                    ...values,
                                    billingTime: dataYearInActives,
                                  });
                                }
                              }
                              return;
                            }

                            if (values.billingDes !== "") {
                              setClickedTime(true);
                              setErrorDes({
                                state: false,
                                message: "",
                              });
                              setValues({
                                ...values,
                                billingTime: [],
                              });
                              return;
                            }

                            setClickedTime(false);
                            setErrorDes({
                              state: true,
                              message:
                                "Por favor complete alguna descripción. Luego presione su conformidad.",
                            });
                          }}
                        >
                          Confirmar renovación
                        </button>
                      </div>
                    </div>
                  </>
                </TabItem>
                <TabItem value={valueTab} index={3}>
                  <>
                    {openSearch && (
                      <>
                        <div style={{ marginBottom: 15 }}>
                          <div>Id: {details.id}</div>
                          <div>Descripción: {details.billingDes}</div>
                        </div>
                      </>
                    )}

                    {isLoadingRenew ? (
                      isErrorRenew ? (
                        "error"
                      ) : (
                        "Buscando historial..."
                      )
                    ) : renews.length > 0 ? (
                      <>
                        <table className="table-edit">
                          <thead>
                            <tr>
                              <th className="td-renew center-th-td">#</th>
                              <th className="td-renew center-th-td">
                                Plan de facturación
                              </th>
                              <th className="td-renew left">Fecha de pago</th>
                              <th className="td-renew">¿Pago anticipado?</th>
                              <th className="td-renew">Fecha de vencimiento</th>
                              <th className="td-renew">Meses renovado</th>
                              <th className="td-renew" style={{ width: 100 }}>
                                ¿Corre el pago el mismo día de la Fec. Venc?
                              </th>
                              <th className="td-renew">
                                Periodo de renovacion
                              </th>
                              <th style={{ width: 30 }} className="td-renew">
                                Anular
                              </th>
                              <th style={{ width: 30 }} className="td-renew">
                                Detalle
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {renews.map((a: any, i: number) => {
                              return (
                                <tr
                                  key={i + 1}
                                  style={
                                    i + 1 === 1
                                      ? {
                                          backgroundColor: "rgb(221, 221, 221)",
                                        }
                                      : {}
                                  }
                                >
                                  <td className="td-renew center-th-td">
                                    {i + 1}
                                  </td>
                                  <td className="td-renew center-th-td">
                                    {a.billing.name}
                                  </td>
                                  <td className="td-renew">
                                    {format(
                                      new Date(String(a.createdAt)),
                                      "dd/MM/yyyy"
                                    )}
                                  </td>
                                  <td className="td-renew center-th-td">
                                    {isBefore(
                                      new Date(String(a.createdAt)),
                                      new Date(String(a.expirationDate))
                                    )
                                      ? "SI"
                                      : "NO"}
                                  </td>
                                  <td className="td-renew center-th-td">
                                    {format(
                                      new Date(String(a.expirationDate)),
                                      "dd/MM/yyyy"
                                    )}
                                  </td>

                                  <td className="td-renew center-th-td">
                                    {isBefore(
                                      new Date(String(a.createdAt)),
                                      new Date(String(a.expirationDate))
                                    ) ? (
                                      <>
                                        {rangeMonthPayed(
                                          a.expirationDate,
                                          a.renovationEnd
                                        ).filter(
                                          (b: any) =>
                                            b.month !==
                                            GET(a.renovationEnd).month
                                        ).length === 0
                                          ? rangeMonthPayed(
                                              a.expirationDate,
                                              a.renovationEnd
                                            )
                                              .map(
                                                (a: any) =>
                                                  `${a.month}(${a.year})`
                                              )
                                              .join(", ")
                                          : rangeMonthPayed(
                                              a.expirationDate,
                                              a.renovationEnd
                                            )
                                              .filter(
                                                (b: any) =>
                                                  b.month !==
                                                  GET(a.renovationEnd).month
                                              )
                                              .map(
                                                (a: any) =>
                                                  `${a.month}(${a.year})`
                                              )
                                              .join(", ")}{" "}
                                        - (
                                        <strong>
                                          {rangeMonthPayed(
                                            a.expirationDate,
                                            a.renovationEnd
                                          ).filter(
                                            (b: any) =>
                                              b.month !==
                                              GET(a.renovationEnd).month
                                          ).length === 0
                                            ? rangeMonthPayed(
                                                a.expirationDate,
                                                a.renovationEnd
                                              ).length
                                            : rangeMonthPayed(
                                                a.expirationDate,
                                                a.renovationEnd
                                              ).filter(
                                                (b: any) =>
                                                  b.month !==
                                                  GET(a.renovationEnd).month
                                              ).length}{" "}
                                          Meses
                                        </strong>
                                        )
                                      </>
                                    ) : (
                                      <>
                                        {rangeMonthPayed(
                                          a.expirationDate,
                                          a.renovationStart
                                        )
                                          .map(
                                            (a: any) => `${a.month}(${a.year})`
                                          )
                                          .join(", ")}{" "}
                                        - (
                                        <strong>
                                          {
                                            rangeMonthPayed(
                                              a.expirationDate,
                                              a.renovationStart
                                            ).length
                                          }{" "}
                                          Meses
                                        </strong>
                                        )
                                      </>
                                    )}
                                  </td>
                                  <td className="td-renew center-th-td">
                                    {a.billingPayToday === ""
                                      ? "PAGO ANTICIPADO"
                                      : a.billingPayToday}
                                  </td>
                                  <td className="td-renew center-th-td">
                                    {format(
                                      new Date(String(a.renovationStart)),
                                      "dd/MM/yyyy"
                                    )}{" "}
                                    -{" "}
                                    {format(
                                      new Date(String(a.renovationEnd)),
                                      "dd/MM/yyyy"
                                    )}
                                  </td>
                                  <td className="td-renew center-th-td">
                                    {a.status === 2 ? (
                                      "En revisión"
                                    ) : (
                                      <RemoveCircleOutlineIcon
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          const object = {
                                            ...a,
                                            index: i + 1,
                                          };
                                          return onClickRemove(object);
                                        }}
                                      />
                                    )}
                                  </td>
                                  <td className="td-renew center-th-td">
                                    <ContentPasteSearchIcon
                                      style={{ cursor: "pointer" }}
                                      onClick={() => onClickDetails(a)}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      "No se ha encontrado registros."
                    )}
                  </>
                </TabItem>
                <DialogActions>
                  <Button onClick={handleClose}>Cancelar</Button>
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={isLoadingCreateVehicle}
                  >
                    OK
                  </Button>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </MyDialogMUI>
  );
};

export default VehicleEdit;
