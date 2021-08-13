import { Customer } from "../../interfaces/customer.interface";
import {
  FormChange,
  InputChange,
  OnKeyUp,
  SelectChange,
} from "../../lib/types";
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
import { Person } from "../../interfaces/person.interface";
import { Company } from "../../interfaces/company.interface";
import { getPerson } from "../../services/api-reniec";
import { getCompany } from "../../services/api-sunat";
import BackDrop from "../backdrop/backdrop";

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
    document: "DNI",
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
    cellphone_2: customer?.cellphone_2 || undefined,
    direction: customer?.direction || undefined,
    username: customer?.username || "",
    password: customer?.password || "",
  };

  const [customerForm, setCustomerForm] = useState<Customer>(
    initialStateUpdate.id ? initialStateUpdate : initialStateCreate
  );
  const [isActive, setActive] = useState<boolean>(false);
  const dispatch = useDispatch();
  const optionsUpdate = useUpdateCustomer();
  const optionsCreate = useCreateCustomer();

  const handleInput = (e: InputChange) => {
    if (e.target.name === "direction" || e.target.name === "cellphone_2") {
      setCustomerForm({
        ...customerForm,
        [e.target.name]: e.target.value === "" ? undefined : e.target.value,
      });
    } else {
      setCustomerForm({
        ...customerForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSelect = (e: SelectChange) => {
    setCustomerForm({
      ...customerForm,
      [e.target.name]: e.target.value,
      name: "",
      lastName: "",
      numDocument: "",
      direction:
        customerForm.document === "RUC" ? undefined : customerForm.direction,
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

  const findRucbyType = (e: any) => {
    const str = e.target.value.substr(0, 2);
    if (str === "10") {
      dispatch(setAlert(initialAlert));
      return "PERSONA NATURAL";
    }
    if (str === "20") {
      dispatch(setAlert(initialAlert));
      return "PERSONA JURIDICA";
    }
  };

  const valiadateRUC = (e: any): boolean => {
    let result = false;
    const str = e.target.value.substr(0, 2);
    if (str === "10" || str === "20") {
      result = false;
    } else {
      dispatch(
        setAlert({
          type: "error",
          text: "Solo existe dos tipos de RUC. Persona natural(10) y Persona Juridica(20).",
        })
      );
      setActive(false);
    }
    return result;
  };

  const handleKeyUp = async (e: OnKeyUp) => {
    if (customerForm.document === "DNI") {
      if (e.target.value.length > 7 && e.target.value.length < 9) {
        setActive(true);
        try {
          const dataPerson: any = await getPerson(e.target.value);
          const person: Person = dataPerson.data.result;

          if (!person!.Nombre && !person!.Paterno && !person!.Materno) {
            dispatch(
              setAlert({
                type: "error",
                text: "No se ha encontrado a la persona. Verifique el nro de documento.",
              })
            );
            setActive(false);
            return;
          } else {
            dispatch(setAlert(initialAlert));
          }

          setCustomerForm({
            ...customerForm,
            name: person!.Nombre || "",
            lastName: person!.Paterno + " " + person!.Materno || "",
          });

          setActive(false);
        } catch (e) {
          alert(e);
          setActive(false);
        }
      }
    } else if (customerForm.document === "RUC") {
      if (e.target.value.length > 10 && e.target.value.length < 12) {
        setActive(true);

        if (valiadateRUC(e)) {
          return;
        }
        try {
          const dataCompany: any = await getCompany(e.target.value);
          const company: Company = dataCompany.data.result;

          if (!company!.RazonSocial) {
            dispatch(
              setAlert({
                type: "error",
                text: "No se ha encontrado Razon social. Verifique el nro de documento",
              })
            );
            setActive(false);
            return;
          } else {
            dispatch(setAlert(initialAlert));
          }

          setCustomerForm({
            ...customerForm,
            name: company!.RazonSocial || "",
            lastName: findRucbyType(e),
            direction:
              company!.Direccion === "-"
                ? "SIN DIRECCION"
                : company!.Direccion || "",
          });

          setActive(false);
        } catch (e) {
          alert(e);
          setActive(false);
        }
      }
    } else {
      dispatch(
        setAlert({
          type: "error",
          text: "Seleccione un documento válido.",
        })
      );
    }
  };

  return (
    <>
      {isActive && <BackDrop state={isActive} />}
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
              onKeyUp={handleKeyUp}
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
          {customerForm.document === "RUC" ? (
            <>
              <Grid item xs={12}>
                <RedditTextField
                  fullWidth
                  type="text"
                  onChange={handleInput}
                  name="name"
                  autoComplete="off"
                  id="idName"
                  label={
                    customerForm.document === "RUC" ? "Razon social" : "Nombres"
                  }
                  variant="filled"
                  value={customerForm.name}
                />
              </Grid>
            </>
          ) : (
            <>
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
            </>
          )}

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
              label="Direccion (opcional)"
              variant="filled"
              value={customerForm.direction || ""}
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
