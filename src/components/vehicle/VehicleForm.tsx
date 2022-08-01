import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Autocomplete } from "@mui/lab";
import { useState } from "react";
import { IModal } from "../../interfaces/modal.interface";

const options = ["Option 1", "Option 2"];

const VehicleForm = ({ open, handleClose }: IModal) => {
  const [value, setValue] = useState<string | null>(options[0]);
  const [inputValue, setInputValue] = useState("");

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Nuevo Vehiculo</DialogTitle>
      <DialogContent dividers>
        <Autocomplete
          value={value}
          onChange={(event: any, newValue: string | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          id="controllable-states-demo"
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Controllable" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button>Cancelar</Button>
        <Button color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;
