import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import DialogForm from "../components/dialog/dialog.component";
import Tooltip from "@material-ui/core/Tooltip";
import { useSelector, useDispatch } from "react-redux";
import CustomerForm from "../components/customer/customer-form";
import IconButton from "@material-ui/core/IconButton";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { Dialog } from "../interfaces/dialog.interface";
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";
import { User } from "../interfaces/user.interface";
import { PERMIT_ONE } from "../const";
import { setAlert } from "../store/alert/action";
import { Customer } from "../interfaces/customer.interface";
import CustomerList from "../components/customer/customer-list";
import { loadAccess } from "../components/acceso/filter-access.component";
import { findError } from "../helpers/control-errors";
import { useGetCustomers } from "../hooks/customer/useGetCustomer";
import { TablePaginationActions } from "../components/table/table-pagination";
import TablePagination from "@material-ui/core/TablePagination";
import SearchBar from "material-ui-search-bar";
import { Button } from "@material-ui/core";

const initialDialog = {
  name: "",
  active: false,
};

const initialAlert = {
  type: "",
  text: "",
};

const CustomerPage = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const page = useSelector((state: any) => state.page.user.module);
  const [dialog, setDialog] = useState<Dialog>(initialDialog);
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { data, loading, error } = useGetCustomers();
  //TABLE OPTIONS
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pagex, setPage] = useState(0);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, customers.length - pagex * rowsPerPage);

  const [searched, setSearched] = useState<string>("");

  const requestSearch = (searchedVal: string) => {
    const filteredRows = data.getCustomer.filter((row: any) => {
      return (
        row.name.toLowerCase().includes(searchedVal.trim().toLowerCase()) ||
        row.lastName.toLowerCase().includes(searchedVal.trim().toLowerCase()) ||
        row.numDocument
          .toLowerCase()
          .includes(searchedVal.trim().toLowerCase()) ||
        row.username.toLowerCase().includes(searchedVal.trim().toLowerCase()) ||
        row.password.toLowerCase().includes(searchedVal.trim().toLowerCase()) ||
        row.document.toLowerCase().includes(searchedVal.trim().toLowerCase())
      );
    });
    setCustomers(filteredRows);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
  };

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //TABLE FIN
  const handleClose = () => {
    setDialog(initialDialog);
    dispatch(setAlert(initialAlert));
  };

  const component = (name: string) => {
    switch (name) {
      case "Crear":
        return <CustomerForm handleClose={handleClose} />;

      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      const allCustomers = data.getCustomer
        .map((customer: any) => {
          return {
            ...customer,
            createdAt: customer.createdAt
              ? new Date(customer.createdAt)
              : new Date(),
            updatedAt: customer.updatedAt
              ? new Date(customer.updatedAt)
              : new Date(),
          };
        })
        .sort(
          (a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      setCustomers(allCustomers);
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
      <Button
        onClick={() => setDialog({ name: "Crear", active: true })}
        variant="contained"
        color="primary"
        endIcon={<AddRoundedIcon />}
      >
        Crear Cliente
      </Button>
    </>
  );

  return (
    <>
      <DialogForm
        open={dialog.active}
        title={`${dialog.name} Cliente`}
        component={component(dialog.name)}
        handleClose={handleClose}
      />
      <div style={{ width: "100%", display: "flex" }}>
        <div style={{ width: "200px" }}>
          {loadAccess(PERMIT_ONE, auth, page, showDialogToCreate)}
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          marginBottom: 10,
          width: "100%",
          display: "flex",
        }}
      >
        {/* documentacion https://www.npmjs.com/package/material-ui-search-bar */}
        <SearchBar
          style={{ width: "100%" }}
          placeholder="Puede buscar por nombres, apellidos, documento, nro de documento, usuario o contrase??a"
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
      </div>
      <TableContainer
        component={Paper}
        style={{ whiteSpace: "nowrap", marginTop: 10 }}
      >
        <Table stickyHeader size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Nombres</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Nro. Documento</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Direcci??n</TableCell>
              <TableCell>Fecha de nacimiento</TableCell>
              <TableCell align="center">Credenciales</TableCell>
              <TableCell>Fecha creada</TableCell>
              <TableCell>Fecha modificada</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? customers.slice(
                  pagex * rowsPerPage,
                  pagex * rowsPerPage + rowsPerPage
                )
              : customers
            ).map((customer) => (
              <CustomerList key={customer.id} customer={customer} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <TablePagination
          rowsPerPageOptions={[
            5,
            10,
            25,
            { label: "Todos los registros", value: -1 },
          ]}
          //colSpan={3}
          style={{ borderBottom: "none" }}
          count={customers.length}
          rowsPerPage={rowsPerPage}
          page={pagex}
          SelectProps={{
            inputProps: { "aria-label": "filas por p??gina" },
            native: true,
          }}
          labelRowsPerPage="filas por p??gina"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
    </>
  );
};

export default CustomerPage;
