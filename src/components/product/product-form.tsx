import { Product } from "../../interfaces/product.interface";
import { useState, useEffect, useCallback } from "react";
import Grid from "@material-ui/core/Grid";
import Progress from "../progress/progress";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import { findError } from "../../helpers/control-errors";
import { setAlert } from "../../store/alert/action";
import { FormChange, InputChange } from "../../lib/types";
import { useDispatch } from "react-redux";
import { useGetCategorys } from "../../hooks/category/useGetCategorys";
import { useUpdateProduct } from "../../hooks/product/useUpdateProduct";
import { useCreateProduct } from "../../hooks/product/useCreateProduct";
import { Category } from "../../interfaces/category.interface";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Brand } from "../../interfaces/brand.interface";
import { useGetBrandsByCategory } from "../../hooks/brand/useBrandsByCategory";
import { useGetModelsByBrand } from "../../hooks/model/useGetModelsByBrand";
import { Model } from "../../interfaces/model.interface";
import { AutoCompleteInput } from "../../interfaces/autocompleteinput.interface";

interface Options {
  handleClose: () => void;
  product?: Product;
}

const initialAlert = {
  type: "",
  text: "",
};

const initialAutoCompleteInput = {
  category: "",
  brand: "",
  model: "",
};

const ProductForm = ({ handleClose, product }: Options) => {
  const initialValueCreate: Product = {
    name: "",
    price: 0,
    category: "",
    brand: "",
    model: "",
  };

  const initialValueUpdate: Product = {
    id: product?.id || "",
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category?.name || "",
    brand: product?.brand?.name || "",
    model: product?.model?.name || "",
  };

  const [productForm, setProductForm] = useState<Product>(
    initialValueUpdate.id ? initialValueUpdate : initialValueCreate
  );
  const [valueInput, setValueInput] = useState<AutoCompleteInput>(
    initialAutoCompleteInput
  );
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const { data } = useGetCategorys();
  const [categorys, setCategorys] = useState<Category[]>([]);
  const dispatch = useDispatch();
  const optionsUpdateProduct = useUpdateProduct();
  const optionsCreateProduct = useCreateProduct();
  const optionsGetBrandsByCategory = useGetBrandsByCategory(
    productForm.category || ""
  );

  const optionsGetModelsByBrand = useGetModelsByBrand(productForm.brand || "");

  const handleInput = (e: InputChange) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
    dispatch(setAlert(initialAlert));
  };

  //https://stackoverflow.com/questions/62588055/how-to-get-the-name-of-material-ui-autocomplete-component

  const dataCategorys = useCallback(() => {
    setCategorys(data.getCategorys);
  }, [data]);

  const changeBrandByCategory = useCallback(() => {
    setBrands(optionsGetBrandsByCategory?.data?.getBrandsByCategory || []);
  }, [optionsGetBrandsByCategory]);

  const changeModelByBrand = useCallback(() => {
    setModels(optionsGetModelsByBrand?.data?.getModelsByBrand || []);
  }, [optionsGetModelsByBrand]);

  const handleKeyUpCategory = (e: any) => {
    if (
      e.target.value.length < productForm.category.length ||
      e.target.value.length === 0
    ) {
      setProductForm({
        ...productForm,
        category: "",
        brand: "",
        model: "",
      });
      setValueInput({
        ...valueInput,
        category: "",
        brand: "",
        model: "",
      });
    }
  };

  const handleKeyUpBrand = (e: any) => {
    if (
      e.target.value.length < productForm.brand.length ||
      e.target.value.length === 0
    ) {
      setProductForm({ ...productForm, brand: "", model: "" });
      setValueInput({
        ...valueInput,
        brand: "",
        model: "",
      });
    }
  };

  const handleKeyUpModel = (e: any) => {
    if (
      e.target.value.length < productForm.model.length ||
      e.target.value.length === 0
    ) {
      setProductForm({ ...productForm, model: "" });
      setValueInput({
        ...valueInput,
        model: "",
      });
    }
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (productForm.id) {
      try {
        await optionsUpdateProduct.updateProduct({
          variables: {
            productInput: { ...productForm, price: Number(productForm.price) },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El producto se actualizó correctamente.",
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
        await optionsCreateProduct.registerProduct({
          variables: {
            productInput: { ...productForm, price: Number(productForm.price) },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El producto ha sido registrada correctamente.",
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
      dataCategorys();
      changeBrandByCategory();
      changeModelByBrand();
    }
  }, [data, dataCategorys, changeBrandByCategory, changeModelByBrand]);

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Autocomplete
            id="idCategory"
            onChange={(event, value) => {
              setProductForm({
                ...productForm,
                category: value?.name || "",
                brand: "",
                model: "",
              });
              setValueInput({
                ...valueInput,
                brand: "",
                model: "",
              });
              dispatch(setAlert(initialAlert));
            }}
            onKeyUp={handleKeyUpCategory}
            inputValue={
              valueInput.category ? valueInput.category : productForm.category
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
        </Grid>

        <Grid item xs={6}>
          <Autocomplete
            id="idBrand"
            onChange={(event, value) => {
              setProductForm({
                ...productForm,
                brand: value?.name || "",
                model: "",
              });
              setValueInput({
                ...valueInput,
                model: "",
              });
              dispatch(setAlert(initialAlert));
            }}
            onKeyUp={handleKeyUpBrand}
            inputValue={valueInput.brand ? valueInput.brand : productForm.brand}
            onInputChange={(e, newValue) => {
              setValueInput({ ...valueInput, brand: newValue });
            }}
            options={brands}
            getOptionLabel={(brand) => (brand.name ? brand.name : "")}
            getOptionSelected={(option, value) =>
              option.name !== value.name ? false : true
            }
            renderInput={(params) => (
              <TextField
                {...params}
                name="brand"
                label="Marca"
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <Autocomplete
            id="idModel"
            onChange={(event, value) => {
              setProductForm({ ...productForm, model: value?.name || "" });
              dispatch(setAlert(initialAlert));
            }}
            onKeyUp={handleKeyUpModel}
            inputValue={valueInput.model ? valueInput.model : productForm.model}
            onInputChange={(e, newValue) => {
              setValueInput({ ...valueInput, model: newValue });
            }}
            options={models}
            getOptionLabel={(model) => (model.name ? model.name : "")}
            getOptionSelected={(option, value) =>
              option.name !== value.name ? false : true
            }
            renderInput={(params) => (
              <TextField
                name="model"
                {...params}
                label="Modelo"
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            onChange={handleInput}
            name="name"
            autoComplete="off"
            id="idName"
            label="Producto"
            variant="outlined"
            value={productForm.name}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="description"
            onChange={handleInput}
            id="idDescription"
            label="Descripción"
            multiline
            rows={6}
            defaultValue={productForm.description}
            variant="outlined"
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
            value={productForm.price}
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
          {productForm.id ? (
            optionsUpdateProduct.loading ? (
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
          ) : optionsCreateProduct.loading ? (
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

export default ProductForm;
