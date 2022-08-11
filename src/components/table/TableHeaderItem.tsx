import { flexRender } from "@tanstack/react-table";
import {
  ClassPropertysTableHeader,
  ITableHeaderItem,
} from "../../interfaces/table.interface";

const TableHeaderItem = ({
  header,
  refElement1,
  refElement2,
  refContentTHeader,
  setShowOptions,
  showOptions,
  table,
  isClicked,
  changeClicked,
  setSpacing,
  setScrolled,
  setLeftTable,
}: ITableHeaderItem) => {
  return (
    <th
      ref={refElement1}
      className="th"
      {...{
        style: {
          backgroundColor: isClicked ? "#e2e2e2" : "",
        },
        colSpan: header.colSpan,
        onClick: () => {
          if (header.id === "actions") {
            setShowOptions(!showOptions);
            const widthHeader =
              refContentTHeader.current &&
              refContentTHeader.current.clientWidth;
            const widthTable = table.getCenterTotalSize();
            const scrollWBody =
              refContentTHeader.current &&
              refContentTHeader.current.scrollWidth;
            setScrolled(
              Number(widthHeader) - Number(scrollWBody) < -25 ? true : false
            );
            setSpacing(Number(widthHeader) - widthTable < 103 ? true : false);
          } else {
            changeClicked();
          }
        },
        //ref: refElement1,
        onMouseOut: () => {
          if (header.id === "actions") {
            if (showOptions) {
              document.onmouseover = function (e) {
                if (
                  (refElement2.current &&
                    refElement2.current.contains(e.target as null)) ||
                  (refElement1.current &&
                    refElement1.current.contains(e.target as null))
                ) {
                  setShowOptions(true);
                } else {
                  setLeftTable(table.getCenterTotalSize());
                  setShowOptions(false);
                  document.onmouseover = null;
                }
              };
            }
          }
        },
      }}
    >
      <div
        {...{
          className: (
            header.column.columnDef as unknown as ClassPropertysTableHeader
          ).classNameHeader,
          style: {
            width: header.column.getSize(),
          },
          onClick: header.column.getToggleSortingHandler(),
        }}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {{
          asc: " 🔼",
          desc: " 🔽",
        }[header.column.getIsSorted() as string] ?? null}
      </div>

      <div
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className:
            header.id !== "actions"
              ? `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`
              : ``,
        }}
      />
    </th>
  );
};

export default TableHeaderItem;
