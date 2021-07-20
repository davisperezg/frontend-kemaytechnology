import { Product } from "../../interfaces/product.interface";
import ProductForm from "./product-form";
import { useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import DialogForm from "../dialog/dialog.component";
import { PERMIT_FOUR, PERMIT_TWO } from "../../const";
import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import { Dialog } from "../../interfaces/dialog.interface";
import moment from "moment";
import { setAlert } from "../../store/alert/action";
import { loadAccess } from "../acceso/filter-access.component";
import { formatMoney } from "../../lib/currency/money";
import { User } from "../../interfaces/user.interface";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const ProductList = ({ product }: { product: Product }) => {
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
      case "Producto":
        return <ProductForm product={product} handleClose={handleClose} />;

      default:
        break;
    }
  };

  const showOptionsForEdit = () => (
    <>
      <DialogForm
        open={dialog.active}
        dialog={product}
        title={dialog.name}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <TableCell align="right">
        <Tooltip
          title="Editar Producto"
          onClick={() => setDialog({ name: "Producto", active: true })}
        >
          <IconButton aria-label="product" size="small">
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
          {product.category!.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {product.brand!.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {product.model!.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {product.name}
        </TableCell>
        <TableCell component="th" scope="row">
          {product.description}
        </TableCell>
        <TableCell component="th" scope="row">
          {formatMoney(product.price)}
        </TableCell>
        <TableCell>{moment(product.createdAt).format("DD/MM/YYYY")}</TableCell>
        <TableCell>{moment(product.updatedAt).format("DD/MM/YYYY")}</TableCell>
        {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
      </TableRow>
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, page, showData)}</>;
};

export default ProductList;
