import { Billing } from "../interfaces/billing.interface";
import { useState, useMemo, useLayoutEffect, useRef } from "react";
import { useGetBilling } from "../hooks/billing/useGetBilling";
import { Button } from "@mui/material";
import TableContainer from "../components/table/TableContainer";
import {
  createColumnHelper,
  DisplayColumnDef,
  IdentifiedColumnDef,
} from "@tanstack/react-table";
import BillingForm from "../components/billing/BillingForm";
import SearchTable from "../components/table/search/SearchTable";
import { InputChange } from "../lib/types";
import BillingEdit from "../components/billing/BillingEdit";
import CloseIcon from "@mui/icons-material/Close";
import { useDeleteBilling } from "../hooks/billing/useDeleteBilling";
import { toast } from "react-toastify";

const columnHelper = createColumnHelper<Billing>();

const defaultColumns = [
  columnHelper.display({
    id: "index",
    cell: (props) => Number(props.row.id) + 1,
    header: () => "#",
    classNameHeader: "div text-center",
    classNameBody: "div-row text-center",
    size: 28,
    minSize: 28,
  } as DisplayColumnDef<Billing, unknown>),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Nombre",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Billing, string>),
  columnHelper.accessor("day", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row text-center",
    header: () => "Dias",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Billing, number>),
  columnHelper.accessor("price", {
    cell: (info) => {
      if (typeof info.getValue() === "number") {
        return info.getValue();
      }
      if (
        typeof info.getValue() === "undefined" ||
        typeof info.getValue() === "object"
      ) {
        return "SIN REGISTRO";
      }
    },
    classNameBody: "div-row text-center",
    header: () => "Precio",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Billing, any>),
  columnHelper.accessor((row) => `${Number(row.price) / Number(row.day)}`, {
    cell: (info) =>
      Number(info.getValue()) === 0 ? "SIN REGISTRO" : info.getValue(),
    id: "priceXday",
    classNameBody: "div-row",
    header: () => "Precio X dia",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as DisplayColumnDef<Billing, any>),
  columnHelper.accessor(
    (row) => `${Number(row.price) / Number(row.day) / 24}`,
    {
      cell: (info) =>
        Number(info.getValue()) === 0 ? "SIN REGISTRO" : info.getValue(),
      id: "priceXhour",
      classNameBody: "div-row",
      header: () => "Precio X hora",
      classNameHeader: "div",
      size: 100,
      minSize: 31,
    } as DisplayColumnDef<Billing, any>
  ),
  columnHelper.accessor("createdAt", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Fecha de creación",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Billing, Date | string>),
  columnHelper.accessor("updatedAt", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Fecha actualizada",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Billing, Date | string>),
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
  } as DisplayColumnDef<Billing, unknown>),
  columnHelper.display({
    id: "actions",
    cell: (props) => "",
    header: () => "...",
    classNameHeader: "div text-center",
    size: 28,
    minSize: 28,
    enableResizing: false,
    enableSorting: false,
  } as DisplayColumnDef<Billing, unknown>),
];

const initialValueEdit: Billing = {
  id: "",
  name: "",
  day: 0,
  price: 0,
};

const BillingPage = () => {
  const [billingEdit, setBillingEdit] = useState<Billing>(initialValueEdit);
  const { data, isLoading, isError, error, isFetching } = useGetBilling();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const searchComponent = useRef<HTMLInputElement>(null);
  const { mutateAsync, isLoading: isLoadingDelete } = useDeleteBilling();

  const handleOpenModalForm = () => setOpenModal(true);
  const handleCloseModalForm = () => setOpenModal(false);

  const dataBillings = useMemo(() => {
    let arrayVehicles: Billing[] = data;

    if (search !== "") {
      const dataVehicle = arrayVehicles.filter((v) =>
        v.name.toLowerCase().includes(search.trim().toLowerCase())
      );

      return dataVehicle;
    }

    return arrayVehicles;
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

  const handleClick = (row: any) => {
    setOpenModalEdit(true);
    setBillingEdit(row.original);
  };

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
    setBillingEdit(initialValueEdit);
  };

  return (
    <>
      <BillingForm open={openModal} handleClose={handleCloseModalForm} />
      <BillingEdit
        open={openModalEdit}
        handleClose={handleCloseModalEdit}
        entity={billingEdit}
      />

      <div style={{ width: "100%" }}>
        <div style={{ float: "left" }}>
          <Button
            onClick={handleOpenModalForm}
            color="primary"
            variant="contained"
            size="small"
          >
            Crear Plan
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
          placeholder="Buscar plan"
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
          data={dataBillings}
          columns={defaultColumns}
          onClickTr={handleClick}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default BillingPage;
