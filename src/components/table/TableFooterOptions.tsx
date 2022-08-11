import { ITableFooterOptions } from "../../interfaces/table.interface";

const TableFooterOptions = ({
  table,
  dataQuery,
  data,
}: ITableFooterOptions) => {
  return (
    <div
      style={{
        background: "none",
        border: 0,
        borderBottom: "3px solid transparent",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        color: "#000",
        flex: "0 0 auto",
      }}
      className="flex items-center gap-2"
    >
      <div
        style={{
          margin: "3px 3px 3px 0px",
          float: "left",
          width: "100%",
          whiteSpace: "nowrap",
          color: "#000",
        }}
      >
        <div
          style={{
            float: "left",
            background: "none",
            height: "24px",
            margin: "0 5px 0 0",
            verticalAlign: "middle",
            whiteSpace: "nowrap",
            color: "#000",
          }}
        >
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            style={{
              minHeight: "24px",
              padding: "0px 18px 0px .5rem",
              border: "1px solid #B4B4B4",
              borderRadius: "2px",
              verticalAlign: "middle",
              fontSize: "12px",
              textAlign: "left",
              textIndent: "0.01px",
              textOverflow: "ellipsis",
              backgroundColor: "#fff",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "100%",
              backgroundImage:
                "url(https://cms.wialon.us/static/skin/misc/ddn.svg)",
              color: "#464646",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            {[10, 20, 50, 100, 500, 1000].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            float: "left",
            background: "none",
            height: "24px",
            margin: "0 5px",
            verticalAlign: "middle",
            whiteSpace: "nowrap",
            color: "#000",
          }}
        >
          {/* ICON */}
          <div
            onClick={() => table.setPageIndex(0)}
            style={{
              float: "left",
              width: "22px",
              height: "22px",
              border: 0,
              cursor: "pointer",
              overflow: "hidden",
              //font-family: HostingFont;
              fontSize: "12px",
              textAlign: "center",
              paddingTop: "2px",
              color: "#9b9c9c",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {"<<"}
          </div>
          <div
            onClick={() => table.previousPage()}
            style={{
              float: "left",
              width: "22px",
              height: "22px",
              border: 0,
              cursor: "pointer",
              overflow: "hidden",
              //font-family: HostingFont;
              fontSize: "12px",
              textAlign: "center",
              paddingTop: "2px",
              color: "#9b9c9c",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {"<"}
          </div>
          <div
            style={{
              float: "left",
              background: "none",
              height: "24px",
              margin: "0 5px",
              verticalAlign: "middle",
              whiteSpace: "nowrap",
              color: "#000",
            }}
          >
            <span style={{ position: "relative", overflow: "visible" }}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <b id="page" style={{ fontWeight: "normal" }} dir="auto">
                        Página
                      </b>
                    </td>
                    <td>
                      <input
                        style={{
                          width: 62,
                          fontSize: "12px",
                          marginTop: "1px",
                          padding: "0 5px",
                          position: "relative",
                          marginLeft: "8px",
                          marginRight: "8px",
                          minHeight: "24px",
                          border: "1px solid #B4B4B4",
                          borderRadius: "var(--button-border-radius)",
                          textAlign: "left",
                          fontFamily: "inherit",
                          color: "#464646",
                          resize: "none",
                          outline: "none",
                        }}
                        type="number"
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => {
                          const page = e.target.value
                            ? Number(e.target.value) - 1
                            : 0;
                          table.setPageIndex(page);
                        }}
                      />
                    </td>
                    <td dir="auto">
                      <b id="of" style={{ fontWeight: "normal" }}>
                        de{" "}
                      </b>
                      <span>{table.getPageCount()}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </span>
          </div>
          <div
            style={{
              float: "left",
              background: "none",
              height: "24px",
              margin: "0 5px",
              verticalAlign: "middle",
              whiteSpace: "nowrap",
              color: "#000",
            }}
          >
            <div
              onClick={() => table.nextPage()}
              style={{
                float: "left",
                width: "22px",
                height: "22px",
                border: 0,
                cursor: "pointer",
                overflow: "hidden",
                //font-family: HostingFont;
                fontSize: "12px",
                textAlign: "center",
                paddingTop: "2px",
                color: "#9b9c9c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {">"}
            </div>
            <div
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              style={{
                float: "left",
                width: "22px",
                height: "22px",
                border: 0,
                cursor: "pointer",
                overflow: "hidden",
                //font-family: HostingFont;
                fontSize: "12px",
                textAlign: "center",
                paddingTop: "2px",
                color: "#9b9c9c",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {">>"}
            </div>
          </div>

          <div
            style={{
              float: "left",
              background: "none",
              height: "24px",
              margin: "0 5px",
              verticalAlign: "middle",
              fontSize: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label>
              Mostrando {dataQuery.rows[0].index} a{" "}
              {dataQuery.rows[dataQuery.rows.length - 1].index} de {data.length}{" "}
              registros
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableFooterOptions;
