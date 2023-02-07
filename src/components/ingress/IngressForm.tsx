import { Ingress } from "../../interfaces/ingress.interface";
import { FormChange, InputChange } from "../../lib/types";
import { useState, useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Progress from "../progress/progress";
import DialogActions from "@mui/material/DialogActions";
import Autocomplete from "@mui/lab/Autocomplete";
import { findError } from "../../helpers/control-errors";
import { setAlert } from "../../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";
import { useUpdateIngress } from "../../hooks/ingress/useUpdateIngress";
import { useCreateIngress } from "../../hooks/ingress/useCreateIngress";
import { useGetCategorys } from "../../hooks/category/useGetCategorys";
import { Category } from "../../interfaces/category.interface";
import { User } from "../../interfaces/user.interface";
import { CircularProgress } from "@mui/material";

interface Options {
  handleClose: () => void;
  ingres?: Ingress;
}

interface IOptions {
  label: string;
  value: string;
}

const initialAlert = {
  type: "",
  text: "",
};

const options = [{ label: "[SELECCIONE UNA CATEGORIA]", value: "999" }];

const IngressForm = ({ handleClose, ingres }: Options) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const initialValueCreate: Ingress = {
    detail: "",
    amount: 0,
    units: 0,
    category: options[0],
    user: auth.name,
  };

  const initialValueUpdate: Ingress = {
    id: ingres?.id || "",
    detail: ingres?.detail || "",
    amount: ingres?.amount || 0,
    units: ingres?.units || 0,
    category: {
      label: ingres?.category.name,
      value: ingres?.category.id,
    },
    observation: ingres?.observation || "",
    //user:auth.name
  };

  const [ingressForm, setIngressForm] = useState<Ingress>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );

  //categoria
  const [value, setValue] = useState<any>(
    initialValueUpdate.id ? initialValueUpdate.category : options[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [customValue, setCustomValue] = useState("");

  const [categorys, setCategorys] = useState<IOptions[]>([]);
  const { data } = useGetCategorys();
  const optionsUpdateIngress = useUpdateIngress();
  const optionsCreateIngress = useCreateIngress();
  const dispatch = useDispatch();

  const handleInput = (e: InputChange) => {
    setIngressForm({
      ...ingressForm,
      [e.target.name]: e.target.value,
    });
    dispatch(setAlert(initialAlert));
  };

  const dataCategorys = useCallback(() => {
    const formated =
      data?.getCategorys.map((a: any) => {
        return {
          label: a.name,
          value: a.id,
        };
      }) || [];

    setCategorys([options[0], ...formated]);
  }, [data]);

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (ingressForm.id) {
      try {
        await optionsUpdateIngress.updateIngress({
          variables: {
            ingressInput: {
              ...ingressForm,
              units: Number(ingressForm.units),
              amount: Number(ingressForm.amount),
            },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El ingreso se actualizó correctamente.",
          })
        );
      } catch (e) {
        dispatch(
          setAlert({
            type: "error",
            text: findError(e),
          })
        );
      }
    } else {
      try {
        await optionsCreateIngress.registerIngress({
          variables: {
            ingressInput: {
              ...ingressForm,
              units: Number(ingressForm.units),
              amount: Number(ingressForm.amount),
            },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El ingreso ha sido registrado correctamente.",
          })
        );
      } catch (e) {
        dispatch(
          setAlert({
            type: "error",
            text: findError(e),
          })
        );
      }
    }
  };

  useEffect(() => {
    dataCategorys();
  }, [dataCategorys]);

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            id="idCategory"
            value={value}
            options={categorys}
            onChange={(event, newValue) => {
              setValue(newValue);
              setCustomValue(String(newValue?.value));
              setIngressForm({
                ...ingressForm,
                category:
                  String(newValue?.value) === "undefined"
                    ? ""
                    : String(newValue?.value),
              });

              dispatch(setAlert(initialAlert));
            }}
            isOptionEqualToValue={(options, value) => {
              return options.value === value.value;
            }}
            getOptionLabel={(option) => option.label}
            getOptionDisabled={(option) => {
              return option.value === options[0].value;
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                name="category"
                label="Categoria"
                variant="outlined"
              />
            )}
            noOptionsText="Sin registros"
            openText="Abrir lista de clientes"
            clearText="Limpiar cliente"
            loadingText="Cargando lista..."
            closeText="Cerrar lista de clientes"
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="units"
            autoComplete="off"
            id="idUnits"
            label="Unidades"
            variant="outlined"
            value={ingressForm.units}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="amount"
            autoComplete="off"
            id="idAmount"
            label="Monto"
            variant="outlined"
            value={ingressForm.amount}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">S/</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            autoComplete="off"
            id="idTotal"
            label="Total"
            variant="outlined"
            value={ingressForm.units * ingressForm.amount}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">S/</InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="detail"
            autoComplete="off"
            id="idDetail"
            multiline
            rows={3}
            label="Detalle"
            variant="outlined"
            value={ingressForm.detail}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="observation"
            autoComplete="off"
            id="idObservation"
            multiline
            rows={5}
            label="Observación"
            variant="outlined"
            value={ingressForm.observation}
          />
        </Grid>

        <DialogActions style={{ width: "100%" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          {ingressForm.id ? (
            optionsUpdateIngress.loading ? (
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
          ) : optionsCreateIngress.loading ? (
            <Progress />
          ) : (
            <Button type="submit" color="primary" autoFocus variant="contained">
              Registrar
            </Button>
          )}
        </DialogActions>
      </Grid>
    </form>
  );
};

export default IngressForm;
