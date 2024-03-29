import { useState, useEffect } from "react";
import { findError } from "../helpers/control-errors";
import { loadAccess } from "../components/acceso/filter-access.component";
import { PERMIT_ONE, PERMIT_TWO } from "../const";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAlert } from "../store/alert/action";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import DialogForm from "../components/dialog/dialog.component";
import { Dialog } from "../interfaces/dialog.interface";
import IconButton from "@mui/material/IconButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { User } from "../interfaces/user.interface";

import { Category } from "../interfaces/category.interface";
import CategoryForm from "../components/category/category-form";
import CategoryList from "../components/category/category-list";
import { useGetCategorys } from "../hooks/category/useGetCategorys";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const CategooryPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();

  const { data, loading, error } = useGetCategorys();
  const [categorys, setCategorys] = useState<Category[]>([]);

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <CategoryForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setCategorys(data.getCategorys);
    }
  }, [data]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (error) {
    return <h1>{findError(error)}</h1>;
  }

  const showDialogToCreate = () => (
    <>
      <DialogForm
        open={dialog.active}
        title={`${dialog.name} Categoria`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <Tooltip title="Crear Categoria">
        <IconButton
          aria-label="add"
          size="small"
          onClick={() => setDialog({ name: "Crear", active: true })}
        >
          <AddRoundedIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const showOptionsForEdit = () => (
    <TableCell align="right">Opciones</TableCell>
  );

  return (
    <>
      {loadAccess(PERMIT_ONE, auth, page, showDialogToCreate)}
      <TableContainer
        component={Paper}
        style={{ whiteSpace: "nowrap", marginTop: 10 }}
      >
        <Table
          //className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Categoria</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
            </TableRow>
          </TableHead>
          <TableBody>
            {categorys.map((category) => (
              <CategoryList key={category.id} category={category} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategooryPage;
