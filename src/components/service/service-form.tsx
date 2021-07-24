import { Service } from "../../interfaces/service.interface";
import { useState, useEffect } from "react";
import { Category } from "../../interfaces/category.interface";
import { useGetCategorys } from "../../hooks/category/useGetCategorys";
import { useDispatch } from "react-redux";
import { useUpdateService } from "../../hooks/service/useUpdateService";
import { useCreateService } from "../../hooks/service/useCreateService";
import { FormChange, InputChange, SelectChange } from "../../lib/types";
import { setAlert } from "../../store/alert/action";
import { findError } from "../../helpers/control-errors";
import Grid from "@material-ui/core/Grid";
import Progress from "../progress/progress";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";

interface Options {
  handleClose: () => void;
  service?: Service;
}

const initialAlert = {
  type: "",
  text: "",
};

const ServiceForm = ({ handleClose, service }: Options) => {
  const initialValueCreate: Service = {
    name: "",
    price: 0,
    category: "",
  };

  const initialValueUpdate: Service = {
    id: service?.id || "",
    name: service?.name || "",
    description: service?.description || "",
    price: service?.price || 0,
    category: service?.category?.name || "",
  };

  const [serviceForm, setServiceForm] = useState<Service>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );

  const [categorys, setCategorys] = useState<Category[]>([]);
  const { data } = useGetCategorys();
  const dispatch = useDispatch();
  const optionsUpdateService = useUpdateService();
  const optionsCreateService = useCreateService();

  const handleInput = (e: InputChange) => {
    setServiceForm({
      ...serviceForm,
      [e.target.name]: e.target.value,
    });
    dispatch(setAlert(initialAlert));
  };

  const handleSelect = (e: SelectChange) => {
    setServiceForm({
      ...serviceForm,
      [e.target.name]: e.target.value,
    });
    dispatch(setAlert(initialAlert));
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (serviceForm.id) {
      try {
        await optionsUpdateService.updateService({
          variables: {
            serviceInput: { ...serviceForm, price: Number(serviceForm.price) },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El servicio se actualizó correctamente.",
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
        await optionsCreateService.registerService({
          variables: {
            serviceInput: { ...serviceForm, price: Number(serviceForm.price) },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El servicio ha sido registrada correctamente.",
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
      setCategorys(data.getCategorys);
    }
  }, [data]);

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="idCategory">Categoria</InputLabel>
            <Select
              labelId="Categoria"
              id="idCategory"
              value={serviceForm.category}
              onChange={handleSelect}
              label="Categoria"
              name="category"
            >
              {categorys.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
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
            label="Servicio"
            variant="outlined"
            value={serviceForm.name}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="description"
            autoComplete="off"
            id="idDescription"
            label="Descripción"
            variant="outlined"
            multiline
            value={serviceForm.description}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="price"
            autoComplete="off"
            id="idPrice"
            label="Precio"
            variant="outlined"
            value={serviceForm.price}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">S/</InputAdornment>
              ),
            }}
          />
        </Grid>

        <DialogActions style={{ width: "100%" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          {serviceForm.id ? (
            optionsUpdateService.loading ? (
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
          ) : optionsCreateService.loading ? (
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

export default ServiceForm;
