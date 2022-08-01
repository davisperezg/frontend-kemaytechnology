import { Brand } from "../../interfaces/brand.interface";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { findError } from "../../helpers/control-errors";
import { FormChange, InputChange, SelectChange } from "../../lib/types";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Progress from "../progress/progress";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useGetCategorys } from "../../hooks/category/useGetCategorys";
import { useUpdateBrand } from "../../hooks/brand/useUpdateBrand";
import { useCreateBrand } from "../../hooks/brand/useCreateBrand";
import { Category } from "../../interfaces/category.interface";

interface Options {
  handleClose: () => void;
  brand?: Brand;
}

const initialAlert = {
  type: "",
  text: "",
};

const BrandForm = ({ handleClose, brand }: Options) => {
  const initialValueCreate: Brand = {
    name: "",
    category: "",
  };

  const initialValueUpdate: Brand = {
    id: brand?.id || "",
    name: brand?.name || "",
    category: brand?.category?.name || "",
  };

  const [brandForm, setBrandForm] = useState<Brand>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );

  const [categorys, setCategorys] = useState<Category[]>([]);
  const { data } = useGetCategorys();
  const dispatch = useDispatch();
  const optionsUpdateBrand = useUpdateBrand();
  const optionsCreateBrand = useCreateBrand();

  const handleInput = (e: InputChange) => {
    setBrandForm({ ...brandForm, [e.target.name]: e.target.value });
    dispatch(setAlert(initialAlert));
  };

  const handleSelect = (e: SelectChange) => {
    setBrandForm({
      ...brandForm,
      [e.target.name]: e.target.value,
    });
    dispatch(setAlert(initialAlert));
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (brandForm.id) {
      try {
        await optionsUpdateBrand.updateBrand({
          variables: {
            brandInput: brandForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La marca se actualizó correctamente.",
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
        await optionsCreateBrand.registerBrand({
          variables: {
            brandInput: brandForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La marca ha sido registrada correctamente.",
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
              value={brandForm.category}
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
            label="Marca"
            variant="outlined"
            value={brandForm.name}
          />
        </Grid>

        <DialogActions style={{ width: "100%" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          {brandForm.id ? (
            optionsUpdateBrand.loading ? (
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
          ) : optionsCreateBrand.loading ? (
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

export default BrandForm;
