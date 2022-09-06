import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import Autocomplete from "@mui/material/Autocomplete";
import { useMemo, useState } from "react";
import { IModal } from "../../interfaces/modal.interface";
import { useGetCustomers } from "../../hooks/customer/useGetCustomer";
import { Customer } from "../../interfaces/customer.interface";
import TabContainer from "../Tab/TabContainer";
import TabElement from "../Tab/TabElement";
import TabItem from "../Tab/TabItem";
import "./vehicle.css";
import { useGetDevices } from "../../hooks/device/useGetDevice";
import { useGetBilling } from "../../hooks/billing/useGetBilling";
import { Device } from "../../interfaces/device.interface";
import { Billing } from "../../interfaces/billing.interface";
import { MyDialogMUI, MyDialogTitleMUI } from "../dialog/DialogV2";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { Vehicle } from "../../interfaces/vehicle.interface";
import * as Yup from "yup";
import { useCreateVehicle } from "../../hooks/vehicle/useCreateVehicle";

interface IOptions {
  label: string;
  value: string;
}

const options: IOptions[] = [
  { label: "[SELECCIONE UN CLIENTE]", value: "999" },
];

const optionsDevice: IOptions[] = [
  { label: "[SELECCIONE UN DISPOSITIVO]", value: "999" },
];

const optionsBilling: IOptions[] = [
  { label: "[SELECCIONE UN PLAN DE FACTURACION]", value: "999" },
];

const initialValue: Vehicle = {
  customer: "",
  device: "",
  billing: "",
  plate: "",
  nroGPS: "",
  platform: "",
  sim: "",
  retired: false,
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
});

const VehicleForm = ({ open, handleClose }: IModal) => {
  const [value, setValue] = useState<IOptions | null>(options[0]);
  const [inputValue, setInputValue] = useState("");
  const [customValue, setCustomValue] = useState("");
  //DEVICE
  const [valueDevice, setValueDevice] = useState<IOptions | null>(
    optionsDevice[0]
  );
  const [inputValueDevice, setInputValueDevice] = useState("");
  const [customValueDevice, setCustomValueDevice] = useState("");
  //BILLING
  const [valueBilling, setValueBilling] = useState<IOptions | null>(
    optionsBilling[0]
  );
  const [inputValueBilling, setInputValueBilling] = useState("");
  const [customValueBilling, setCustomValueBilling] = useState("");

  const [valueTab, setValueTab] = useState("1");
  const {
    data,
    isLoading,
    isError: isErrorCustomer,
    isFetching,
    error: errorCustomer,
  } = useGetCustomers();
  const {
    data: dataDevices,
    isLoading: isLoadingDevices,
    isError: isErrorDevices,
    isFetching: isFetchingDevices,
    error: errorDevice,
  } = useGetDevices();
  const {
    data: dataBillings,
    isLoading: isLoadingBillings,
    isError: isErrorBillings,
    isFetching: isFetchingBillings,
    error: errorBilling,
  } = useGetBilling();
  const [errorLocal, setErrorLocal] = useState<[]>([]);
  const { mutateAsync, isLoading: isLoadingCreateVehicle } = useCreateVehicle();

  const memoCustomers: IOptions[] = useMemo(() => {
    let dataCustomers: any[] = [];

    if (data) {
      const customers = data.map((a: Customer) => {
        return {
          label: a.name + " " + a.lastName,
          value: a.id,
        };
      });

      dataCustomers = [options[0], ...customers];
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

      myDevices = [optionsDevice[0], ...devices];
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
        };
      });

      myBillings = [optionsBilling[0], ...billings];
    }

    return myBillings;
  }, [dataBillings]);

  const handleChangeTab = (newValue: string) => {
    setValueTab(newValue);
  };

  return (
    <MyDialogMUI
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
      maxWidth="sm"
      //sx={{ maxHeight: 553 }}
    >
      <MyDialogTitleMUI id="scroll-dialog-title">
        Nuevo Vehiculo
      </MyDialogTitleMUI>
      <TabContainer>
        <TabElement
          handleClick={() => handleChangeTab("1")}
          value={valueTab}
          index={1}
        >
          General
        </TabElement>
        <TabElement
          handleClick={() => handleChangeTab("2")}
          value={valueTab}
          index={2}
        >
          Renovar
        </TabElement>
      </TabContainer>
      {isErrorCustomer &&
        JSON.parse(JSON.stringify(errorCustomer))
          .response.errors.map((a: any) =>
            a.extensions.exception.response.message.map((b: any) => b)
          )
          .map((b: any, i: number) => (
            <>
              <div
                key={i + 1}
                style={{ background: "red", color: "#fff", padding: 10 }}
              >
                {i + 1}.- {b}
              </div>
              <br />
            </>
          ))}
      {isErrorDevices &&
        JSON.parse(JSON.stringify(errorDevice))
          .response.errors.map((a: any) =>
            a.extensions.exception.response.message.map((b: any) => b)
          )
          .map((b: any, i: number) => (
            <>
              <div
                key={i + 1}
                style={{ background: "red", color: "#fff", padding: 10 }}
              >
                {i + 1}.- {b}
              </div>
              <br />
            </>
          ))}
      {isErrorBillings &&
        JSON.parse(JSON.stringify(errorBilling))
          .response.errors.map((a: any) =>
            a.extensions.exception.response.message.map((b: any) => b)
          )
          .map((b: any, i: number) => (
            <>
              <div
                key={i + 1}
                style={{ background: "red", color: "#fff", padding: 10 }}
              >
                {i + 1}.- {b}
              </div>
              <br />
            </>
          ))}
      <DialogContent>
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await mutateAsync({
                variables: {
                  vehicleInput: values,
                },
              });
              resetForm();
              handleClose();
            } catch (e: any) {
              const myErrors = JSON.parse(
                JSON.stringify(e)
              ).response.errors.map((a: any) =>
                a.extensions.exception.response.message.map((b: any) => b)
              );
              const [desErrors] = myErrors;
              setErrorLocal(desErrors);
              toast.error(
                desErrors
                  .map((e: any, i: number) => {
                    return `${i + 1}.- ${e}`;
                  })
                  .join("\n")
              );
            }
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
                <TabItem value={valueTab} index={1}>
                  <Grid container spacing={2}>
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
                        getOptionDisabled={(option) => {
                          return option.value === options[0].value;
                        }}
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
                        getOptionDisabled={(option) => {
                          return option.value === options[0].value;
                        }}
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
                      <Autocomplete
                        onBlur={handleBlur}
                        size="small"
                        id="billing"
                        options={memoBillings}
                        loading={isLoadingBillings}
                        value={valueBilling}
                        isOptionEqualToValue={(options, value) => {
                          return options.value === value.value;
                        }}
                        getOptionLabel={(option) => option.label}
                        getOptionDisabled={(option) => {
                          return option.value === options[0].value;
                        }}
                        onChange={(event, newValue) => {
                          setValueBilling(newValue);
                          setCustomValueBilling(String(newValue?.value));
                          setValues({
                            ...values,
                            billing:
                              String(newValue?.value) === "undefined"
                                ? ""
                                : String(newValue?.value),
                          });
                        }}
                        inputValue={inputValueBilling}
                        onInputChange={(event, newInputValue) => {
                          setInputValueBilling(newInputValue);
                        }}
                        renderOption={(params, option) => (
                          <li {...params}>
                            {isLoadingBillings ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <label>Cargando planes...</label>
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
                            label="Plan de facturación"
                            error={
                              touched.billing && errors.billing ? true : false
                            }
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isFetchingBillings ? (
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
                        openText="Abrir lista de planes"
                        clearText="Limpiar planes"
                        loadingText="Cargando lista..."
                        closeText="Cerrar lista de planes"
                      />
                      {touched.billing && errors.billing && (
                        <FormHelperText
                          sx={{ color: "#D32F2F" }}
                          id="billing-error-text"
                        >
                          {errors.billing}
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
                            MULTIOPERADOR
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
                      <strong>{values.plate}</strong> que pertenece a{" "}
                      <strong>{inputValue}</strong> con número de DNI, 00001258.
                    </p>
                    <div className="flex-beetwen">
                      <label>Actualmente tiene el plan</label>
                      <div>PREMIUN</div>
                    </div>
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

export default VehicleForm;
