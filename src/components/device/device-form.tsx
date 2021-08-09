import { useState } from "react";
import { useDispatch } from "react-redux";
import { FormChange, InputChange } from "../../lib/types";
import { findError } from "../../helpers/control-errors";
import { setAlert } from "../../store/alert/action";
import Grid from "@material-ui/core/Grid";
import RedditTextField from "../textfield/reddit";
import { Device } from "../../interfaces/device.interface";
import { useUpdateDevice } from "../../hooks/device/useUpdateDevice";
import { useCreateDevice } from "../../hooks/device/useCreateDevice";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import Progress from "../progress/progress";

interface Option {
  handleClose?: () => void;
  device?: Device;
}

const DeviceForm = ({ handleClose, device }: Option) => {
  const initialStateCreate: Device = {
    name: "",
  };

  const initialStateUpdate: Device = {
    id: device?.id || "",
    name: device?.name || "",
  };

  const [deviceForm, setDeviceForm] = useState<Device>(
    initialStateUpdate.id ? initialStateUpdate : initialStateCreate
  );
  const dispatch = useDispatch();
  const optionsUpdate = useUpdateDevice();
  const optionsCreate = useCreateDevice();

  const handleInput = (e: InputChange) => {
    setDeviceForm({
      ...deviceForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: FormChange) => {
    e.preventDefault();

    if (deviceForm.id) {
      try {
        await optionsUpdate.updateDevice({
          variables: {
            deviceInput: deviceForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "El dispositivo se actualizó correctamente.",
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
        await optionsCreate.registerDevice({
          variables: {
            deviceInput: deviceForm,
          },
        });
        dispatch(
          setAlert({
            type: "success",
            text: "La dispositivo ha sido registrado correctamente.",
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
            <RedditTextField
              fullWidth
              type="text"
              onChange={handleInput}
              name="name"
              autoComplete="off"
              id="idName"
              label="Nombre"
              variant="filled"
              value={deviceForm.name}
            />
          </Grid>
          <DialogActions style={{ width: "100%" }}>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            {deviceForm.id ? (
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

export default DeviceForm;
