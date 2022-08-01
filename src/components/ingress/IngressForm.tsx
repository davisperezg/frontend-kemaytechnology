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
import { AutoCompleteInput } from "../../interfaces/autocompleteinput.interface";
import { User } from "../../interfaces/user.interface";

interface Options {
  handleClose: () => void;
  ingres?: Ingress;
}

const initialAlert = {
  type: "",
  text: "",
};

const initialAutoCompleteInput = {
  category: "",
};

const IngressForm = ({ handleClose, ingres }: Options) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const initialValueCreate: Ingress = {
    detail: "",
    amount: 0,
    units: 0,
    category: "",
    user: auth.name,
  };

  const initialValueUpdate: Ingress = {
    id: ingres?.id || "",
    detail: ingres?.detail || "",
    amount: ingres?.amount || 0,
    units: ingres?.units || 0,
    category: ingres?.category?.name || "",
    observation: ingres?.observation || "",
    //user:auth.name
  };

  const [ingressForm, setIngressForm] = useState<Ingress>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );
  const [valueInput, setValueInput] = useState<AutoCompleteInput>(
    initialAutoCompleteInput
  );
  const [categorys, setCategorys] = useState<Category[]>([]);
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
    setCategorys(data?.getCategorys || []);
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
        {/* <Grid item xs={12}>
          <Autocomplete
            id="idCategory"
            value={ingressForm.category}
            onChange={(event, value) => {
              setIngressForm({
                ...ingressForm,
                category: value?.name || "",
              });

              dispatch(setAlert(initialAlert));
            }}
            inputValue={
              valueInput.category ? valueInput.category : ingressForm.category
            }
            onInputChange={(e, newValue) => {
              setValueInput({ ...valueInput, category: newValue });
            }}
            options={categorys}
            getOptionLabel={(category) => (category.name ? category.name : "")}
            getOptionSelected={(option, value) =>
              option.name !== value.name ? false : true
            }
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
