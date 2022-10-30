import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnResizeMode,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { UIEvent, useEffect, useMemo, useRef, useState } from "react";
import { ITableParam } from "../../interfaces/table.interface";
import TableBodyTrItem from "./TableBodyTrItem";
import TableFooterOptions from "./TableFooterOptions";
import TableHeaderItem from "./TableHeaderItem";

const TableContainer = ({
  data = [],
  columns,
  loading,
  idle,
  onClickTr,
  handleDelete,
}: ITableParam) => {
  const refElement1 = useRef<HTMLTableCellElement>(null);
  const refElement2 = useRef<HTMLDivElement>(null);
  const refContentTHeader = useRef<HTMLDivElement>(null);
  const refContentTBody = useRef<HTMLDivElement>(null);
  const [clicked, setClicked] = useState<number>(0);
  const [spacing, setSpacing] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [leftTable, setLeftTable] = useState<number>(0);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const changeClicked = (index: number) => {
    setClicked(index);
  };

  const dataQuery = {
    rows:
      data
        .map((a, i) => {
          return {
            ...a,
            index: i + 1,
          };
        })
        .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize) || [],
    pageCount: Math.ceil(data.length / pageSize),
  };

  const table = useReactTable({
    data: dataQuery.rows,
    columns,
    pageCount: dataQuery.pageCount,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    columnResizeMode,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (typeof refContentTHeader === "object") {
      if (refContentTHeader.current) {
        refContentTHeader.current.scrollLeft = e.currentTarget.scrollLeft;
        refContentTHeader.current.scrollTop = e.currentTarget.scrollTop;
      }
    }
  };

  useEffect(() => {
    if (table) {
      setLeftTable(table.getCenterTotalSize());
    }
  }, [table]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        overflow: "hidden",
        border:
          loading || !dataQuery.rows[0]
            ? "1px solid rgb(208, 206, 207)"
            : "0 solid #eee",
        color: "#000",
        position: "relative",
        justifyContent: loading || !dataQuery.rows[0] ? "center" : "",
        alignItems: loading || !dataQuery.rows[0] ? "center" : "",
      }}
    >
      {idle === "idle" && loading === true ? (
        <label>
          Para iniciar la busqueda por favor ingrese el rango de fechas y haga
          click en consultar.
        </label>
      ) : loading ? (
        <label>Cargando registros...</label>
      ) : (
        !dataQuery.rows[0] && (
          <label>No se ha encontrado ningun registro.</label>
        )
      )}
      {/* SHOW OPTIONS */}
      {/* INICIO HEADER BODY */}
      {dataQuery.rows[0] && (
        <div
          ref={refContentTHeader}
          style={{
            display: "flex",
            flex: "0 0 auto",
            background: "#f4f4f4",
            position: "relative",
            border: "1px solid #d0cecf",
            overflow: "hidden",
          }}
        >
          <div style={{ float: "left", paddingRight: 40, color: "#464646" }}>
            <table
              style={{
                borderRight: "1px solid #444",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, i) => {
                      return (
                        <TableHeaderItem
                          key={header.id}
                          header={header}
                          isClicked={clicked === i}
                          changeClicked={() => changeClicked(i)}
                          refElement1={refElement1}
                          refElement2={refElement2}
                          showOptions={showOptions}
                          setShowOptions={setShowOptions}
                          table={table}
                          refContentTHeader={refContentTHeader}
                          setSpacing={setSpacing}
                          setScrolled={setScrolled}
                          setLeftTable={setLeftTable}
                        />
                      );
                    })}
                  </tr>
                ))}
              </thead>
            </table>
          </div>
        </div>
      )}

      {/* FIN HEADER BODY */}

      {/* INICIO DIV BODY */}
      {dataQuery.rows[0] && (
        <div
          onScroll={handleScroll}
          ref={refContentTBody}
          style={{
            flex: "1 1 auto",
            backgroundColor: "#fff",
            position: "relative",
            border: "1px solid #d0cecf",
            overflow: "auto",
            width: "100%",
            color: "#000",
            userSelect: "text",
            height: "260px",
            borderTop: 0,
          }}
        >
          <table
            {...{
              style: {
                width: table.getCenterTotalSize(),
                marginBottom: 10,
              },
            }}
          >
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <TableBodyTrItem
                  key={row.id}
                  row={row}
                  i={i}
                  onClickTr={() => onClickTr !== undefined && onClickTr!(row)}
                  handleDelete={() => handleDelete!(row)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FIN DIV BODY */}
      {/* INICIO FOOTER TABLE */}
      {dataQuery.rows[0] && (
        <TableFooterOptions table={table} dataQuery={dataQuery} data={data} />
      )}
      {/* FIN FOOTER TABLE */}
    </div>
  );
};

export default TableContainer;
