import { useState } from "react";

import { Category } from "../../interfaces/category.interface";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Progress from "../progress/progress";
import { FormChange, InputChange } from "../../lib/types";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";
import { findError } from "../../helpers/control-errors";
import { useCreateCategory } from "../../hooks/category/useCreateCategory";
import { useUpdateCategory } from "../../hooks/category/useUpdateCategory";

const initialAlert = {
  type: "",
  text: "",
};

const CategoryForm = ({ handleClose, category }: any) => {
  const initialValueCreate: Category = {
    name: "",
  };

  const initialValueUpdate: Category = {
    id: category?.id || "",
    name: category?.name || "",
  };

  const [categoryForm, setCategoryForm] = useState<Category>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );

  const dispatch = useDispatch();
  const optionsUpdateCategory = useUpdateCategory();
  const optionsCreateCategory = useCreateCategory();

  const handleInput = (e: InputChange) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
    dispatch(setAlert(initialAlert));
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (categoryForm.id) {
      try {
        await optionsUpdateCategory.updateCategory({
          variables: {
            categoryInput: categoryForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La categoria se actualizó correctamente.",
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
        await optionsCreateCategory.registerCategory({
          variables: {
            categoryInput: categoryForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La categoria ha sido registrado correctamente.",
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

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="name"
            autoComplete="off"
            id="idName"
            label="Nombre"
            variant="outlined"
            value={categoryForm.name}
          />
        </Grid>

        <DialogActions style={{ width: "100%" }}>
          <Button onClick={() => handleClose()} color="primary">
            Cancelar
          </Button>
          {categoryForm.id ? (
            optionsUpdateCategory.loading ? (
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
          ) : optionsCreateCategory.loading ? (
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

export default CategoryForm;
