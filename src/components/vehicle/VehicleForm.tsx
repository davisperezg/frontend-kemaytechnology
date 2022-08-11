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
      <TabItem value={valueTab} index={1}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                size="small"
                id="customers"
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
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isFetching ? (
                            <CircularProgress color="inherit" size={20} />
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
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                id="device"
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
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isFetchingDevices ? (
                            <CircularProgress color="inherit" size={20} />
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
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
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
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isFetchingBillings ? (
                            <CircularProgress color="inherit" size={20} />
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
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="platform">Plataforma</InputLabel>
                <Select
                  labelId="platform"
                  id="select-platform"
                  //value={age}
                  label="Plataforma"
                  //onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                id="outlined-basic"
                label="Placa"
                variant="outlined"
                fullWidth
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="chip">Chip</InputLabel>
                <Select
                  labelId="chip"
                  id="select-chip"
                  //value={age}
                  label="Chip"
                  //onChange={handleChange}
                >
                  <MenuItem value="MOVISTAR">MOVISTAR</MenuItem>
                  <MenuItem value="CLARO">CLARO</MenuItem>
                  <MenuItem value="ENTEL">ENTEL</MenuItem>
                  <MenuItem value="BITEL">BITEL</MenuItem>
                  <MenuItem value="INKACEL">INKACEL</MenuItem>
                  <MenuItem value="MULTIOPERADOR">MULTIOPERADOR</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                size="small"
                id="outlined-basic"
                label="Nro de GPS"
                variant="outlined"
                fullWidth
                autoComplete="off"
              />
            </Grid>

            <Grid item xs={12}>
              <div className="content-check">
                <label className="text-check">
                  Marca la casilla si el gps del cliente ha sido retirado
                </label>
                <FormGroup style={{ float: "right" }}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked size="small" />}
                    label="Retirado"
                  />
                </FormGroup>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </TabItem>
      <TabItem value={valueTab} index={2}>
        <label>TAB 2</label>
      </TabItem>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </MyDialogMUI>
  );
};

export default VehicleForm;
