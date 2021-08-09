import { Customer } from "../../interfaces/customer.interface";
import { FormChange, InputChange, SelectChange } from "../../lib/types";
import Grid from "@material-ui/core/Grid";
import { useState } from "react";
import RedditTextField from "../textfield/reddit";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { setAlert } from "../../store/alert/action";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Progress from "../progress/progress";
import { useUpdateCustomer } from "../../hooks/customer/useUpdateCustomer";
import { useCreateCustomer } from "../../hooks/customer/useCreateCustomer";
import { findError } from "../../helpers/control-errors";

interface Option {
  handleClose?: () => void;
  customer?: Customer;
}

const initialAlert = {
  type: "",
  text: "",
};

const CustomerForm = ({ handleClose, customer }: Option) => {
  const initialStateCreate: Customer = {
    name: "",
    lastName: "",
    document: "",
    numDocument: "",
    cellphone_1: "",
    username: "",
    password: "",
  };

  const initialStateUpdate: Customer = {
    id: customer?.id || "",
    name: customer?.name || "",
    lastName: customer?.lastName || "",
    document: customer?.document || "",
    numDocument: customer?.numDocument || "",
    cellphone_1: customer?.cellphone_1 || "",
    cellphone_2: customer?.cellphone_2 || "",
    direction: customer?.direction || "",
    username: customer?.username || "",
    password: customer?.password || "",
  };

  const [customerForm, setCustomerForm] = useState<Customer>(
    initialStateUpdate.id ? initialStateUpdate : initialStateCreate
  );
  const dispatch = useDispatch();
  const optionsUpdate = useUpdateCustomer();
  const optionsCreate = useCreateCustomer();

  const handleInput = (e: InputChange) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (e: SelectChange) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value,
    });
    dispatch(setAlert(initialAlert));
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (customerForm.id) {
      try {
        await optionsUpdate.updateCustomer({
          variables: {
            customerInput: customerForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La cliente se actualizó correctamente.",
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
        await optionsCreate.registerCustomer({
          variables: {
            customerInput: customerForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La cliente ha sido registrado correctamente.",
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
    <>
      <form onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="idDocument">Documento</InputLabel>
              <Select
                labelId="Document"
                id="idDocument"
                value={customerForm.document}
                onChange={handleSelect}
                label="Documento"
                name="document"
              >
                <MenuItem value="DNI">DNI</MenuItem>
                <MenuItem value="RUC">RUC</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="numDocument"
              autoComplete="off"
              id="idNumDocument"
              label="Nro de documento"
              variant="filled"
              value={customerForm.numDocument}
            />
          </Grid>
          <Grid item xs={6}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="name"
              autoComplete="off"
              id="idName"
              label="Nombres"
              variant="filled"
              value={customerForm.name}
            />
          </Grid>
          <Grid item xs={6}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="lastName"
              autoComplete="off"
              id="idLastName"
              label="Apellidos"
              variant="filled"
              value={customerForm.lastName}
            />
          </Grid>
          <Grid item xs={6}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="cellphone_1"
              autoComplete="off"
              id="idCellphone1"
              label="Celular"
              variant="filled"
              value={customerForm.cellphone_1}
            />
          </Grid>
          <Grid item xs={6}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="cellphone_2"
              autoComplete="off"
              id="idCellphonen2"
              label="Celular (opcional)"
              variant="filled"
              value={customerForm.cellphone_2}
            />
          </Grid>
          <Grid item xs={12}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="direction"
              autoComplete="off"
              id="idDirection"
              label="Dirección"
              variant="filled"
              value={customerForm.direction}
            />
          </Grid>
          <Grid item xs={6}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="username"
              autoComplete="off"
              id="idUserame"
              label="Usuario"
              variant="filled"
              value={customerForm.username}
            />
          </Grid>
          <Grid item xs={6}>
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="password"
              autoComplete="off"
              id="idPassword"
              label="Contraseña"
              variant="filled"
              value={customerForm.password}
            />
          </Grid>
          <DialogActions style={{ width: "100%" }}>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            {customerForm.id ? (
              optionsUpdate.loading ? (
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
            ) : optionsCreate.loading ? (
              <Progress />
            ) : (
              <Button
                type="submit"
                color="primary"
                autoFocus
                variant="contained"
              >
                Registrar
              </Button>
            )}
          </DialogActions>
        </Grid>
      </form>
    </>
  );
};

export default CustomerForm;
