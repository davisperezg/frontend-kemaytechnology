import { ITableBodyItem } from "../../interfaces/table.interface";
import TableBodyTdItem from "./TableBodyTdItem";

const TableBodyTrItem = ({
  row,
  i,
  onClickTr,
  handleDelete,
}: ITableBodyItem) => {
  return (
    <tr
      className="tbody-tr"
      style={
        i % 2 !== 0
          ? {
              backgroundColor: "#f7f7f7",
            }
          : {
              backgroundColor: "#fff",
            }
      }
    >
      {row.getVisibleCells().map((cell) => {
        return (
          <TableBodyTdItem
            cell={cell}
            row={row}
            key={cell.id}
            onClickTr={onClickTr}
            handleDelete={handleDelete}
          />
        );
      })}
    </tr>
  );
};

export default TableBodyTrItem;
