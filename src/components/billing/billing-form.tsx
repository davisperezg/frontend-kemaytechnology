import { Billing } from "../../interfaces/billing.interface";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCreateBilling } from "../../hooks/billing/useCreateBilling";
import { FormChange, InputChange } from "../../lib/types";
import { useUpdateBilling } from "../../hooks/billing/useUpdateBilling";
import { findError } from "../../helpers/control-errors";
import { setAlert } from "../../store/alert/action";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Progress from "../progress/progress";
import { TextField } from "@mui/material";

interface Option {
  handleClose?: () => void;
  billing?: Billing;
}

const BillingForm = ({ handleClose, billing }: Option) => {
  const initialStateCreate: Billing = {
    name: "",
    day: 0,
  };

  const initialStateUpdate: Billing = {
    id: billing?.id || "",
    name: billing?.name || "",
    day: billing?.day || 0,
  };

  const [billingForm, setBillingForm] = useState<Billing>(
    initialStateUpdate.id ? initialStateUpdate : initialStateCreate
  );
  const dispatch = useDispatch();
  const optionsUpdate = useUpdateBilling();
  const optionsCreate = useCreateBilling();

  const handleInput = (e: InputChange) => {
    setBillingForm({
      ...billingForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (billingForm.id) {
      try {
        await optionsUpdate.updateBilling({
          variables: {
            billingInput: {
              ...billingForm,
              day: Number(billingForm.day),
            },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El plan se actualizó correctamente.",
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
        await optionsCreate.registerBilling({
          variables: {
            billingInput: {
              ...billingForm,
              day: Number(billingForm.day),
            },
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La plan ha sido registrado correctamente.",
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
            <TextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="name"
              autoComplete="off"
              id="idName"
              label="Nombre"
              variant="filled"
              value={billingForm.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              onChange={handleInput}
              name="day"
              autoComplete="off"
              id="idDay"
              label="Dias"
              variant="filled"
              value={billingForm.day}
            />
          </Grid>
          <DialogActions style={{ width: "100%" }}>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            {billingForm.id ? (
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

export default BillingForm;
