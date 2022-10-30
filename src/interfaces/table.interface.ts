import { ColumnDef, Cell, Row, Table, Header } from "@tanstack/react-table";
import { RefObject, SetStateAction, Dispatch } from "react";

export interface ITableParam {
  columns: ColumnDef<any, unknown>[] | any[];
  data: any[];
  loading?: boolean;
  idle?: string;
  onClickTr?: (row: any) => void;
  handleDelete?: (row: any) => void;
}

export interface ITableTdItem {
  cell: Cell<unknown, unknown>;
  row: Row<unknown>;
  onClickTr?: () => void;
  handleDelete?: () => void;
}

export interface ITableBodyItem {
  row: Row<unknown>;
  i: number;
  onClickTr?: () => void;
  handleDelete?: () => void;
}

export interface ClassPropertysTableBody {
  classNameBody: string;
}

export interface ClassPropertysTableHeader {
  classNameHeader: string;
}

export interface ITableFooterOptions {
  table: Table<unknown>;
  dataQuery: {
    rows: any[];
    pageCount: number;
  };
  data: any[];
}

export interface ITableHeaderItem {
  header: Header<unknown, any>;
  refElement1: RefObject<HTMLTableCellElement>;
  refElement2: RefObject<HTMLDivElement>;
  refContentTHeader: RefObject<HTMLDivElement>;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  showOptions: boolean;
  table: Table<unknown>;
  isClicked: boolean;
  changeClicked: () => void;
  setSpacing: Dispatch<SetStateAction<boolean>>;
  setScrolled: Dispatch<SetStateAction<boolean>>;
  setLeftTable: Dispatch<SetStateAction<number>>;
}
