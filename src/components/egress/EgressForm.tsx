import { Egress } from "../../interfaces/egress.interface";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Progress from "../progress/progress";
import DialogActions from "@mui/material/DialogActions";
import Autocomplete from "@mui/lab/Autocomplete";
import { useState, useCallback, useEffect } from "react";
import { useGetCategorys } from "../../hooks/category/useGetCategorys";
import { FormChange, InputChange } from "../../lib/types";
import { Category } from "../../interfaces/category.interface";
import { useUpdateEgress } from "../../hooks/egress/useUpdateEgress";
import { useCreateEgress } from "../../hooks/egress/useCreateEgress";
import { findError } from "../../helpers/control-errors";
import { setAlert } from "../../store/alert/action";
import { useDispatch, useSelector } from "react-redux";
import InputAdornment from "@mui/material/InputAdornment";
import { AutoCompleteInput } from "../../interfaces/autocompleteinput.interface";
import { User } from "../../interfaces/user.interface";

interface Options {
  handleClose: () => void;
  egress?: Egress;
}

interface IOptions {
  label: string;
  value: string;
}

const initialAlert = {
  type: "",
  text: "",
};

const initialAutoCompleteInput = {
  category: "",
};

const options = [{ label: "[SELECCIONE UNA CATEGORIA]", value: "999" }];

const EgressForm = ({ handleClose, egress }: Options) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);

  const initialValueCreate: Egress = {
    detail: "",
    amount: 0,
    units: 0,
    category: options[0],
    user: auth.name,
  };

  const initialValueUpdate: Egress = {
    id: egress?.id || "",
    detail: egress?.detail || "",
    amount: egress?.amount || 0,
    units: egress?.units || 0,
    category: {
      label: egress?.category.name,
      value: egress?.category.id,
    },
    observation: egress?.observation || "",
    //user: auth.name
  };

  const [egressForm, setEgressForm] = useState<Egress>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );

  //categoria
  const [value, setValue] = useState<any>(
    initialValueUpdate.id ? initialValueUpdate.category : options[0]
  );
  const [inputValue, setInputValue] = useState("");
  const [customValue, setCustomValue] = useState("");

  const [categorys, setCategorys] = useState<Category[]>([]);
  const { data } = useGetCategorys();
  const optionsUpdateEgress = useUpdateEgress();
  const optionsCreateEgress = useCreateEgress();
  const dispatch = useDispatch();

  const handleInput = (e: InputChange) => {
    setEgressForm({
      ...egressForm,
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

    if (egressForm.id) {
      try {
        await optionsUpdateEgress.updateEgress({
          variables: {
            egressInput: {
              ...egressForm,
              units: Number(egressForm.units),
              amount: Number(egressForm.amount),
            },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El egreso se actualizó correctamente.",
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
        await optionsCreateEgress.registerEgress({
          variables: {
            egressInput: {
              ...egressForm,
              units: Number(egressForm.units),
              amount: Number(egressForm.amount),
            },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El egreso ha sido registrado correctamente.",
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
              setEgressForm({
                ...egressForm,
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
            value={egressForm.units}
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
            value={egressForm.amount}
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
            value={egressForm.units * egressForm.amount}
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
            value={egressForm.detail}
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
            value={egressForm.observation}
          />
        </Grid>

        <DialogActions style={{ width: "100%" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          {egressForm.id ? (
            optionsUpdateEgress.loading ? (
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
          ) : optionsCreateEgress.loading ? (
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

export default EgressForm;
