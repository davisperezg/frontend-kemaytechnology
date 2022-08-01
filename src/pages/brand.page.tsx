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

import BrandList from "../components/brand/brand-list";
import BrandForm from "../components/brand/brand-form";
import { Brand } from "../interfaces/brand.interface";
import { useGetBrands } from "../hooks/brand/useGetBrands";

const initialAlert = {
  type: "",
  text: "",
};

const initialDialog = {
  name: "",
  active: false,
};

const BrandPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();

  const { data, loading, error } = useGetBrands();
  const [brands, setBrands] = useState<Brand[]>([]);

  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <BrandForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      setBrands(data.getBrands);
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
        title={`${dialog.name} Marca`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <Tooltip title="Crear Marca">
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
              <TableCell>Marca</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              {loadAccess(PERMIT_TWO, auth, page, showOptionsForEdit)}
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <BrandList key={brand.id} brand={brand} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BrandPage;
