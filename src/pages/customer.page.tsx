import { useState, useLayoutEffect, useMemo, useRef } from "react";
import { Customer } from "../interfaces/customer.interface";
import { useGetCustomers } from "../hooks/customer/useGetCustomer";
import { Button } from "@mui/material";
import SearchTable from "../components/table/search/SearchTable";
import TableContainer from "../components/table/TableContainer";
import { useDeleteCustomer } from "../hooks/customer/useDeleteCustomer";
import { InputChange } from "../lib/types";
import { toast } from "react-toastify";
import {
  createColumnHelper,
  DisplayColumnDef,
  IdentifiedColumnDef,
} from "@tanstack/react-table";
import CloseIcon from "@mui/icons-material/Close";
import CustomerForm from "../components/customer/CustomerForm";
import CustomerEdit from "../components/customer/CustomerEdit";

const columnHelper = createColumnHelper<Customer>();

const defaultColumns = [
  columnHelper.display({
    id: "index",
    cell: (props) => Number(props.row.id) + 1,
    header: () => "#",
    classNameHeader: "div text-center",
    classNameBody: "div-row text-center",
    size: 28,
    minSize: 28,
  } as DisplayColumnDef<Customer, unknown>),
  columnHelper.accessor((row) => `${row.name} ${row.lastName}`, {
    id: "customer",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Cliente",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Customer, string>),
  columnHelper.accessor("document", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Documento",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Customer, string>),
  columnHelper.accessor("numDocument", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Nro de documento",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Customer, string>),
  columnHelper.accessor(
    (row) =>
      `${row.cellphone_1} ${row.cellphone_2 ? " - " + row.cellphone_2 : ""}`,
    {
      id: "cellphones",
      cell: (info) => info.getValue(),
      classNameBody: "div-row",
      header: () => "Contacto",
      classNameHeader: "div",
      size: 100,
      minSize: 31,
    } as DisplayColumnDef<Customer, string>
  ),
  columnHelper.accessor("direction", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Dirección",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Customer, string>),
  columnHelper.accessor("fecha_nac", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Fecha de nacimiento",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Customer, string>),
  columnHelper.accessor((row) => `${row.username}/${row.password}`, {
    id: "credentials",
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Credenciales",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Customer, string>),
  columnHelper.accessor("createdAt", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Fecha creada",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Customer, Date | string>),
  columnHelper.accessor("updatedAt", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Fecha actualizada",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Customer, Date | string>),
  columnHelper.display({
    id: "delete",
    cell: (props) => {
      return <CloseIcon sx={{ fontSize: 18 }} htmlColor="red" />;
    },
    classNameBody: "div-row text-center",
    header: () => "Eliminar",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Customer, unknown>),
  columnHelper.display({
    id: "actions",
    cell: (props) => "",
    header: () => "...",
    classNameHeader: "div text-center",
    size: 28,
    minSize: 28,
    enableResizing: false,
    enableSorting: false,
  } as DisplayColumnDef<Customer, unknown>),
];

const initialValueEdit: Customer = {
  id: "",
  name: "",
  lastName: "",
  document: "",
  numDocument: "",
  cellphone_1: "",
  cellphone_2: "",
  direction: "",
  username: "",
  password: "",
  fecha_nac: "",
};

const CustomerPage = () => {
  const { data, isLoading, isError, error, isFetching } = useGetCustomers();
  const searchComponent = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [customerEdit, setCustomerEdit] = useState<Customer>(initialValueEdit);
  const { mutateAsync, isLoading: isLoadingDelete } = useDeleteCustomer();

  const handleOpenModalForm = () => setOpenModal(true);
  const handleCloseModalForm = () => setOpenModal(false);

  const customers = useMemo(() => {
    let arrayCustomers: Customer[] = data;

    if (search !== "") {
      const dataCustomers = arrayCustomers
        .map((f) => {
          return {
            ...f,
            customerFullname: f.name + " " + f.lastName,
          };
        })
        .filter(
          (v) =>
            v.customerFullname
              .toLowerCase()
              .includes(search.trim().toLowerCase()) ||
            v.numDocument.toLowerCase().includes(search.trim().toLowerCase()) ||
            v.username.toLowerCase().includes(search.trim().toLowerCase()) ||
            v.password.toLowerCase().includes(search.trim().toLowerCase()) ||
            v.document.toLowerCase().includes(search.trim().toLowerCase())
        );

      return dataCustomers;
    }

    return arrayCustomers;
  }, [data, search]);

  const handleSearch = (e: InputChange) => {
    const value: string = (
      searchComponent.current?.value as string
    ).toUpperCase();
    setSearch(value);
  };

  useLayoutEffect(() => {
    if (searchComponent.current) {
      searchComponent.current.focus();
    }
  }, []);

  const handleDelete = async (row: any) => {
    const confirmAlert = window.confirm(
      `¿Estas seguro que deseas eliminar ${row.original.name}?`
    );

    if (confirmAlert) {
      try {
        await mutateAsync({
          variables: {
            id: row.original.id,
          },
        });
      } catch (e) {
        const myErrors = JSON.parse(JSON.stringify(e)).response.errors.map(
          (a: any) => a.extensions.exception.response.message.map((b: any) => b)
        );
        toast.error(myErrors.map((a: any) => a));
      }
    }
  };

  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setCustomerEdit(initialValueEdit);
  };

  const handleClick = (row: any) => {
    setOpenModalEdit(true);
    setCustomerEdit(row.original);
  };

  return (
    <>
      {/* documentacion https://www.npmjs.com/package/material-ui-search-bar */}
      <CustomerForm open={openModal} handleClose={handleCloseModalForm} />
      {openModalEdit && (
        <CustomerEdit
          open={openModalEdit}
          handleClose={handleCloseModalEdit}
          entity={customerEdit}
        />
      )}

      <div style={{ width: "100%" }}>
        <div style={{ float: "left" }}>
          <Button
            onClick={handleOpenModalForm}
            color="primary"
            variant="contained"
            size="small"
          >
            Crear Cliente
          </Button>
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
        <SearchTable
          handleSearch={handleSearch}
          searchComponent={searchComponent}
          placeholder="Buscar cliente, documento, nro de documento, usuario o contraseña"
        />

        {(isFetching || isLoadingDelete) && (
          <div
            style={{ display: "flex", marginLeft: 10, alignItems: "flex-end" }}
          >
            <label style={{ fontSize: 12 }}>
              {isLoadingDelete
                ? "Eliminando objeto..."
                : "Refrescando lista..."}
            </label>
          </div>
        )}
      </div>

      {isError ? (
        JSON.parse(JSON.stringify(error))
          .response.errors.map((a: any) =>
            a.extensions.exception.response.message.map((b: any) => b)
          )
          .map((b: any, i: number) => (
            <>
              <div
                key={i + 1}
                style={{ background: "red", color: "#fff", padding: 10 }}
              >
                {i + 1}.- {b}
              </div>
              <br />
            </>
          ))
      ) : (
        <TableContainer
          loading={isLoading}
          data={customers}
          columns={defaultColumns}
          onClickTr={handleClick}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default CustomerPage;
