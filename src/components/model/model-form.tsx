import { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { Model } from "../../interfaces/model.interface";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { findError } from "../../helpers/control-errors";
import { FormChange, InputChange, SelectChange } from "../../lib/types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Progress from "../progress/progress";
import { useUpdateModel } from "../../hooks/model/useUpdateModel";
import { useCreateModel } from "../../hooks/model/useCreateModel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Brand } from "../../interfaces/brand.interface";
import { useGetBrands } from "../../hooks/brand/useGetBrands";

interface Options {
  handleClose: () => void;
  model?: Model;
}

const initialAlert = {
  type: "",
  text: "",
};

const ModelForm = ({ handleClose, model }: Options) => {
  const initialValueCreate: Model = {
    name: "",
    brand: "",
  };

  const initialValueUpdate: Model = {
    id: model?.id || "",
    name: model?.name || "",
    brand: model?.brand?.name || "",
  };

  const [modelForm, setModelForm] = useState<Model>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );

  const [brands, setBrands] = useState<Brand[]>([]);
  const { data } = useGetBrands();
  const dispatch = useDispatch();
  const optionsUpdateModel = useUpdateModel();
  const optionsCreateModel = useCreateModel();

  const handleInput = (e: InputChange) => {
    setModelForm({ ...modelForm, [e.target.name]: e.target.value });
    dispatch(setAlert(initialAlert));
  };

  const handleSelect = (e: SelectChange) => {
    setModelForm({
      ...modelForm,
      [e.target.name]: e.target.value,
    });
    dispatch(setAlert(initialAlert));
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (modelForm.id) {
      try {
        await optionsUpdateModel.updateModel({
          variables: {
            modelInput: modelForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El modelo se actualizó correctamente.",
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
        await optionsCreateModel.registerModel({
          variables: {
            modelInput: modelForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El modelo ha sido registrado correctamente.",
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
    if (data) {
      setBrands(data.getBrands);
    }
  }, [data]);

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="idMarca">Marca</InputLabel>
            <Select
              labelId="Marca"
              id="idMarca"
              value={modelForm.brand}
              onChange={handleSelect}
              label="Marca"
              name="brand"
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.name}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="name"
            autoComplete="off"
            id="idName"
            label="Modelo"
            variant="outlined"
            value={modelForm.name}
          />
        </Grid>

        <DialogActions style={{ width: "100%" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          {modelForm.id ? (
            optionsUpdateModel.loading ? (
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
          ) : optionsCreateModel.loading ? (
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

export default ModelForm;
