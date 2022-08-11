import { flexRender } from "@tanstack/react-table";
import {
  ClassPropertysTableBody,
  ITableTdItem,
} from "../../interfaces/table.interface";

const TableBodyTdItem = ({
  cell,
  row,
  onClickTr,
  handleDelete,
}: ITableTdItem) => {
  return (
    <td
      className={`${cell.id !== row.id + "_actions" ? "td" : "td-empty"}`}
      {...{
        onClick: () => {
          if (cell.column.id === "delete") {
            handleDelete!();
          } else {
            onClickTr!();
          }
        },
      }}
    >
      <div
        {...{
          className: (
            cell.column.columnDef as unknown as ClassPropertysTableBody
          ).classNameBody,
        }}
        style={{
          width: cell.column.getSize(),
        }}
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </td>
  );
};

export default TableBodyTdItem;
