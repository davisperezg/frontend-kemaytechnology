import { useGetDevices } from "../hooks/device/useGetDevice";
import {
  createColumnHelper,
  DisplayColumnDef,
  IdentifiedColumnDef,
} from "@tanstack/react-table";
import { Device } from "../interfaces/device.interface";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import SearchTable from "../components/table/search/SearchTable";
import { useLayoutEffect, useRef, useState, useMemo } from "react";
import { InputChange } from "../lib/types";
import TableContainer from "../components/table/TableContainer";
import { useDeleteDevice } from "../hooks/device/useDeleteDevice";
import { toast } from "react-toastify";
import DeviceForm from "../components/device/DeviceForm";
import DeviceEdit from "../components/device/DeviceEdit";

const columnHelper = createColumnHelper<Device>();

const defaultColumns = [
  columnHelper.display({
    id: "index",
    cell: (props) => Number(props.row.id) + 1,
    header: () => "#",
    classNameHeader: "div text-center",
    classNameBody: "div-row text-center",
    size: 28,
    minSize: 28,
  } as DisplayColumnDef<Device, unknown>),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Nombre",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Device, string>),
  columnHelper.accessor("reference", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Referencia",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Device, string>),
  columnHelper.accessor("createdAt", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Fecha de creación",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Device, Date | string>),
  columnHelper.accessor("updatedAt", {
    cell: (info) => info.getValue(),
    classNameBody: "div-row",
    header: () => "Fecha actualizada",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  } as IdentifiedColumnDef<Device, Date | string>),
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
  } as DisplayColumnDef<Device, unknown>),
  columnHelper.display({
    id: "actions",
    cell: (props) => "",
    header: () => "...",
    classNameHeader: "div text-center",
    size: 28,
    minSize: 28,
    enableResizing: false,
    enableSorting: false,
  } as DisplayColumnDef<Device, unknown>),
];

const initialValueEdit: Device = {
  id: "",
  name: "",
};

const DevicePage = () => {
  const { data, isLoading, isError, error, isFetching } = useGetDevices();
  const searchComponent = useRef<HTMLInputElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [deviceEdit, setDeviceEdit] = useState<Device>(initialValueEdit);
  const { mutateAsync, isLoading: isLoadingDelete } = useDeleteDevice();

  const handleOpenModalForm = () => setOpenModal(true);
  const handleCloseModalForm = () => setOpenModal(false);

  const devices = useMemo(() => {
    let arrayDevices: Device[] = data;

    if (search !== "") {
      const dataDevices = arrayDevices.filter((v) =>
        v.name.toLowerCase().includes(search.trim().toLowerCase())
      );

      return dataDevices;
    }

    return arrayDevices;
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
    setDeviceEdit(initialValueEdit);
  };

  const handleClick = (row: any) => {
    setOpenModalEdit(true);
    setDeviceEdit(row.original);
  };

  return (
    <>
      <DeviceForm open={openModal} handleClose={handleCloseModalForm} />
      {openModalEdit && (
        <DeviceEdit
          open={openModalEdit}
          handleClose={handleCloseModalEdit}
          entity={deviceEdit}
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
            Crear Dispositivo
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
          data={devices}
          columns={defaultColumns}
          onClickTr={handleClick}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default DevicePage;
