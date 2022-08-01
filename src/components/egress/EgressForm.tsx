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

const initialAlert = {
  type: "",
  text: "",
};

const initialAutoCompleteInput = {
  category: "",
};

const EgressForm = ({ handleClose, egress }: Options) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);

  const initialValueCreate: Egress = {
    detail: "",
    amount: 0,
    units: 0,
    category: "",
    user: auth.name,
  };

  const initialValueUpdate: Egress = {
    id: egress?.id || "",
    detail: egress?.detail || "",
    amount: egress?.amount || 0,
    units: egress?.units || 0,
    category: egress?.category?.name || "",
    observation: egress?.observation || "",
    //user: auth.name
  };

  const [egressForm, setEgressForm] = useState<Egress>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );
  const [valueInput, setValueInput] = useState<AutoCompleteInput>(
    initialAutoCompleteInput
  );
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
    setCategorys(data?.getCategorys || []);
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
        {/* <Grid item xs={12}>
          <Autocomplete
            id="idCategory"
            value={egressForm.category}
            onChange={(event, value) => {
              setEgressForm({
                ...egressForm,
                category: value?.name || "",
              });

              dispatch(setAlert(initialAlert));
            }}
            inputValue={
              valueInput.category ? valueInput.category : egressForm.category
            }
            onInputChange={(e, newValue) => {
              setValueInput({ ...valueInput, category: newValue });
            }}
            options={categorys}
            getOptionLabel={(category) => (category.name ? category.name : "")}
            getOptionSelected={(option, value) => option.name === value}
            renderInput={(params) => (
              <TextField
                {...params}
                name="category"
                label="Categoria"
                variant="outlined"
              />
            )}
          />
        </Grid> */}

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
