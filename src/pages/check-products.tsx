/* eslint-disable no-use-before-define */
import Grid from "@mui/material/Grid";
import RedditTextField from "../components/textfield/reddit";
import Button from "@mui/material/Button";
import { loadAccess } from "../components/acceso/filter-access.component";
import { PERMIT_FOUR } from "../const";
import { useSelector } from "react-redux";
import { User } from "../interfaces/user.interface";
import { CheckProduct } from "../interfaces/check-product.interface";
import { InputChange } from "../lib/types";
import { useState, useCallback, useEffect } from "react";
import { Autocomplete } from "@mui/lab";
import { AutoCompleteInput } from "../interfaces/autocompleteinput.interface";
import TextField from "@mui/material/TextField";
import { Model } from "../interfaces/model.interface";
import { useGetCategorys } from "../hooks/category/useGetCategorys";
import { useGetBrandsByCategory } from "../hooks/brand/useBrandsByCategory";
import { useGetModelsByBrand } from "../hooks/model/useGetModelsByBrand";
import { Category } from "../interfaces/category.interface";
import { Brand } from "../interfaces/brand.interface";
import { useGetProductsCMM } from "../hooks/product/useGetProductByCMM";
import { Product } from "../interfaces/product.interface";
import { useGetProductByName } from "../hooks/product/useProductByName";
import Progress from "../components/progress/progress";
import { formatMoney } from "../lib/currency/money";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Service } from "../interfaces/service.interface";
import { useGetServicesByCategory } from "../hooks/service/useGetServicesByCategory";
import { useGetServiceByName } from "../hooks/service/useServiceByName";

const initialAutoCompleteInput = {
  category: "",
  brand: "",
  model: "",
  product: "",
  service: "",
};

const initialState: CheckProduct = {
  category: "",
  brand: "",
  model: "",
  product: "",
  service: "",
};

const intialValue = {
  product: true,
  service: false,
};

const CheckProducts = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const { module, page } = useSelector((state: any) => {
    return state.page.user;
  });

  const [checkProduct, setCheckProduct] = useState<CheckProduct>(initialState);
  const [valueInput, setValueInput] = useState<AutoCompleteInput>(
    initialAutoCompleteInput
  );
  const [categorys, setCategorys] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isActiveRadio, setActiveRadio] = useState(intialValue);
  const { data } = useGetCategorys();
  const optionsGetBrandsByCategory = useGetBrandsByCategory(
    checkProduct.category || ""
  );
  const optionsGetServiceByCategory = useGetServicesByCategory(
    checkProduct.category || ""
  );
  const optionsGetModelsByBrand = useGetModelsByBrand(checkProduct.brand || "");
  const optionsGetProductsCMM = useGetProductsCMM(
    checkProduct.category || "",
    checkProduct.brand || "",
    checkProduct.model || ""
  );

  const optionGetProduct = useGetProductByName();
  const optionGetService = useGetServiceByName();

  const dataCategorys = useCallback(() => {
    setCategorys(data?.getCategorys || []);
  }, [data]);

  const changeBrandByCategory = useCallback(() => {
    setBrands(optionsGetBrandsByCategory?.data?.getBrandsByCategory || []);
  }, [optionsGetBrandsByCategory]);

  const changeServiceByCategory = useCallback(() => {
    setServices(optionsGetServiceByCategory?.data?.getServicesByCategory || []);
  }, [optionsGetServiceByCategory]);

  const changeModelByBrand = useCallback(() => {
    setModels(optionsGetModelsByBrand?.data?.getModelsByBrand || []);
  }, [optionsGetModelsByBrand]);

  const changeProductCMM = useCallback(() => {
    setProducts(
      optionsGetProductsCMM?.data?.getProductsByCategoryBrandModel || []
    );
  }, [optionsGetProductsCMM]);

  const getProduct = async (product: string | undefined) => {
    try {
      await optionGetProduct.getProductByName({
        variables: {
          product: product,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getService = async (service: string | undefined) => {
    try {
      await optionGetService.getServiceByName({
        variables: {
          service: service,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeRadio = (e: any) => {
    if (e.target.name === "product") {
      setActiveRadio({
        product: isActiveRadio.service,
        service: !isActiveRadio.service,
      });
    } else {
      setActiveRadio({
        product: !isActiveRadio.product,
        service: isActiveRadio.product,
      });
    }
  };

  useEffect(() => {
    dataCategorys();
    changeBrandByCategory();
    changeModelByBrand();
    changeProductCMM();
    changeServiceByCategory();
  }, [
    dataCategorys,
    changeBrandByCategory,
    changeModelByBrand,
    changeProductCMM,
    changeServiceByCategory,
  ]);

  return (
    <>
      <div
        style={{
          background: "#fff",
          borderRadius: 6,
          border: "1px solid #e2e2e1",
        }}
      >
        <div style={{ margin: "20px 20px 0px 20px" }}>
          <RadioGroup row aria-label="position" onChange={handleChangeRadio}>
            <FormControlLabel
              value="product"
              checked={isActiveRadio.product}
              control={<Radio color="primary" name="product" />}
              label="Producto"
            />
            <FormControlLabel
              value="service"
              checked={isActiveRadio.service}
              control={<Radio color="primary" name="service" />}
              label="Servicio"
            />
          </RadioGroup>
        </div>

        <div
          style={{
            display: "flex",
            padding: 20,
          }}
        >
          <div style={{ width: "50%" }}>
            <Grid
              container
              spacing={3}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* <Grid item xs={12}>
                <Autocomplete
                  id="idCategory"
                  onChange={(event, value) => {
                    setCheckProduct({
                      ...checkProduct,
                      category: value?.name || "",
                      brand: "",
                      model: "",
                      product: "",
                    });
                    setValueInput({
                      ...valueInput,
                      brand: "",
                      model: "",
                    });
                  }}
                  onInputChange={(e, newValue) => {
                    setValueInput({ ...valueInput, category: newValue });
                  }}
                  options={categorys}
                  getOptionLabel={(category) => category.name}
                  getOptionSelected={(option, value) =>
                    option.name === value.name
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

              {/* {isActiveRadio.product ? (
                <>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="idBrand"
                      onChange={(event, value) => {
                        setCheckProduct({
                          ...checkProduct,
                          brand: value?.name || "",
                          model: "",
                          product: "",
                        });
                        setValueInput({
                          ...valueInput,
                          model: "",
                          product: "",
                        });
                      }}
                      onInputChange={(e, newValue) => {
                        setValueInput({ ...valueInput, brand: newValue });
                      }}
                      options={brands}
                      getOptionLabel={(brand) => brand.name}
                      getOptionSelected={(option, value) =>
                        option.name === value.name
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

                  <Grid item xs={12}>
                    <Autocomplete
                      id="idModel"
                      onChange={(event, value) => {
                        setCheckProduct({
                          ...checkProduct,
                          model: value?.name || "",
                          product: "",
                        });
                        setValueInput({
                          ...valueInput,
                          product: "",
                        });
                      }}
                      onInputChange={(e, newValue) => {
                        setValueInput({ ...valueInput, model: newValue });
                      }}
                      options={models}
                      getOptionLabel={(model) => model.name}
                      getOptionSelected={(option, value) =>
                        option.name === value.name
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="model"
                          label="Modelo"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Autocomplete
                      id="idProduct"
                      onChange={(event, value) => {
                        setCheckProduct({
                          ...checkProduct,
                          product: value?.name || "",
                        });
                      }}
                      onInputChange={(e, newValue) => {
                        setValueInput({ ...valueInput, product: newValue });
                      }}
                      options={products}
                      getOptionLabel={(product) => product.name}
                      getOptionSelected={(option, value) =>
                        option.name === value.name
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="product"
                          label="Productos"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </>
              ) : (
                <Grid item xs={12}>
                  <Autocomplete
                    id="idService"
                    onChange={(event, value) => {
                      setCheckProduct({
                        ...checkProduct,
                        service: value?.name || "",
                      });
                    }}
                    onInputChange={(e, newValue) => {
                      setValueInput({ ...valueInput, service: newValue });
                    }}
                    options={services}
                    getOptionLabel={(service) => service.name}
                    getOptionSelected={(option, value) =>
                      option.name === value.name
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name="service"
                        label="Servicios"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              )}
              {isActiveRadio.product ? (
                <Grid item xs={12}>
                  {optionGetProduct.loading ? (
                    <Progress />
                  ) : (
                    <Button
                      fullWidth
                      type="button"
                      onClick={() => getProduct(valueInput.product)}
                      color="primary"
                      variant="contained"
                    >
                      Consultar
                    </Button>
                  )}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  {optionGetService.loading ? (
                    <Progress />
                  ) : (
                    <Button
                      fullWidth
                      type="button"
                      onClick={() => getService(valueInput.service)}
                      color="primary"
                      variant="contained"
                    >
                      Consultar
                    </Button>
                  )}
                </Grid>
              )} */}
            </Grid>
          </div>
          <div
            style={{
              width: "50%",
              padding: "0px 0px 0px 20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                height: "80%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: "10%",
                  display: "flex",
                  justifyContent: "center",
                  background: optionGetProduct!.data
                    ? "yellow"
                    : optionGetService!.data
                    ? "yellow"
                    : "#fff",
                }}
              >
                <strong>
                  {isActiveRadio.product
                    ? optionGetProduct!.data &&
                      `Descripción del producto ${
                        optionGetProduct!.data.getProductByName.name
                      }`
                    : optionGetService!.data &&
                      `Descripción del servicio ${
                        optionGetService!.data.getServiceByName.name
                      }`}
                </strong>
              </div>
              <div
                style={{
                  height: "90%",
                  display: "flex",
                  justifyContent: "center",
                  wordBreak: "break-all",
                  fontSize: "15px",
                  alignItems: "center",
                }}
              >
                {isActiveRadio.product
                  ? optionGetProduct!.data &&
                    optionGetProduct!.data.getProductByName.description
                  : optionGetService!.data &&
                    optionGetService!.data.getServiceByName.description}
              </div>
            </div>
            <div
              style={{
                height: "20%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <label style={{ fontSize: 75 }}>
                {isActiveRadio.product
                  ? optionGetProduct!.data &&
                    formatMoney(optionGetProduct!.data.getProductByName.price)
                  : optionGetService!.data &&
                    formatMoney(optionGetService!.data.getServiceByName.price)}
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckProducts;
