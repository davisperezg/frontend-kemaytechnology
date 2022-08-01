import EgressPage from "./egress.page";
import IngressPage from "./ingress.page";
import "./css/summary-box.css";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { PagoProvider } from "../context/caja-context";
import { useState } from "react";
import { formatMoney } from "../lib/currency/money";

interface Option {
  checkMoney?: any;
  resultIngress?: any;
  resultEgress?: any;
}

const SummaryBoxPage = ({
  checkMoney,
  resultIngress,
  resultEgress,
}: Option) => {
  const [summaryIngress, setSummaryIngress] = useState({
    ingress: 0,
  });

  const [summaryEgress, setSummaryEgress] = useState({
    egress: 0,
  });

  return (
    <>
      <PagoProvider
        value={{
          summaryIngress,
          setSummaryIngress,
          summaryEgress,
          setSummaryEgress,
        }}
      >
        <div className="content-tables-i-e">
          <div className="card-table" style={{ marginRight: "4%" }}>
            <IngressPage
              checkMoney={checkMoney}
              resultIngress={resultIngress}
              resultEgress={resultEgress}
            />
          </div>
          <div className="card-table">
            <EgressPage
              checkMoney={checkMoney}
              resultIngress={resultIngress}
              resultEgress={resultEgress}
            />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableBody>
                <TableRow>
                  {/* <TableCell colSpan={page === "RESUMEN-CAJA" ? 3 : 6} /> */}
                  <TableCell>
                    <strong>Resumen total</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong
                      style={
                        summaryIngress.ingress - summaryEgress.egress < 0
                          ? { color: "red" }
                          : { color: "green" }
                      }
                    >
                      {summaryIngress.ingress - summaryEgress.egress < 0
                        ? formatMoney(
                            summaryIngress.ingress - summaryEgress.egress
                          )
                        : `+${formatMoney(
                            summaryIngress.ingress - summaryEgress.egress
                          )}`}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </PagoProvider>
    </>
  );
};

export default SummaryBoxPage;
