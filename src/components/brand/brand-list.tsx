import { Brand } from "../../interfaces/brand.interface";
import { useState } from "react";

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import DialogForm from "../dialog/dialog.component";
import { PERMIT_FOUR, PERMIT_TWO } from "../../const";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { User } from "../../interfaces/user.interface";
import { Dialog } from "../../interfaces/dialog.interface";
import moment from "moment";
import { setAlert } from "../../store/alert/action";
import { loadAccess } from "../acceso/filter-access.component";
import BrandForm from "./brand-form";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const BrandList = ({ brand }: { brand: Brand }) => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Marca":
        return <BrandForm brand={brand} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const showOptionsForEdit = () => (
    <>
      <DialogForm
        open={dialog.active}
        dialog={brand}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <TableCell align="right">
        <Tooltip
          title="Editar Marca"
          onClick={() => setDialog({ name: "Marca", active: true })}
        >
          <IconButton aria-label="role" size="small">
            <EditRoundedIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );

  const showData = () => (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {brand.category!.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {brand.name}
        </TableCell>
        <TableCell>{moment(brand.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(brand.updatedAt).format("DD/MM/YYYY")}</TableCell>
        {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
      </TableRow>
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, page, showData)}</>;
};

export default BrandList;
