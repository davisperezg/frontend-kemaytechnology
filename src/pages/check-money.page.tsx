import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import RedditTextField from "../components/textfield/reddit";
import moment from "moment";
import { InputChange } from "../lib/types";
import { CheckMoney } from "../interfaces/check-money.interface";
import { useState, useEffect } from "react";
import SummaryBoxPage from "./summary-box.page";
import { loadAccess } from "../components/acceso/filter-access.component";
import { PERMIT_FOUR } from "../const";
import { useSelector } from "react-redux";
import { User } from "../interfaces/user.interface";
import { useGetEgressByDate } from "../hooks/summary-box/useGetEgerssByDates";
import { useGetIngressByDate } from "../hooks/summary-box/useGetIngressByDates";
import { Ingress } from "../interfaces/ingress.interface";
import { Egress } from "../interfaces/egress.interface";

const CheckMoneyPage = () => {
  const now = moment().utc().local().format("YYYY-MM-DD");
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const { module, page } = useSelector((state: any) => {
    return state.page.user;
  });

  const optionsIngress = useGetIngressByDate();
  const optionsEgress = useGetEgressByDate();

  const initialState: CheckMoney = {
    dateStart: now,
    dateEnd: now,
  };

  const [checkMoney, setCheckMoney] = useState<CheckMoney>(initialState);
  const [resultIngress, setResultIngress] = useState<Ingress[]>([]);
  const [resultEgress, setResultEgress] = useState<Egress[]>([]);

  const handleInput = (e: InputChange) => {
    setCheckMoney({
      ...checkMoney,
      [e.target.name]: e.target.value,
    });
  };

  const getIngress = async (start: string | Date, end: string | Date) => {
    try {
      await optionsIngress.getIngressByDates({
        variables: {
          start: start,
          end: end,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getEgress = async (start: string | Date, end: string | Date) => {
    try {
      await optionsEgress.getEgressByDates({
        variables: {
          start: start,
          end: end,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (optionsIngress.data) {
      setResultIngress(optionsIngress?.data?.getIngressByDates || []);
    }
    if (optionsEgress.data) {
      setResultEgress(optionsEgress?.data?.getEgressByDates || []);
    }
  }, [optionsIngress.data, optionsEgress.data]);

  const showData = () => (
    <>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <RedditTextField
            fullWidth
            type="date"
            onChange={handleInput}
            name="dateStart"
            autoComplete="off"
            id="idStart"
            label="Desde"
            variant="filled"
            value={checkMoney.dateStart}
          />
        </Grid>
        <Grid item xs={3}>
          <RedditTextField
            fullWidth
            type="date"
            onChange={handleInput}
            name="dateEnd"
            autoComplete="off"
            id="idEnd"
            label="Hasta"
            variant="filled"
            value={checkMoney.dateEnd}
          />
        </Grid>
        <Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() =>
              getIngress(checkMoney.dateStart, checkMoney.dateEnd) &&
              getEgress(checkMoney.dateStart, checkMoney.dateEnd)
            }
            variant="contained"
            size="large"
            color="primary"
          >
            Consultar
          </Button>
        </Grid>
        {/* {optionsIngress!.data &&
          alert(optionsIngress!.data.getIngressByDates[0].detail)} */}
      </Grid>
      <SummaryBoxPage
        checkMoney={checkMoney}
        resultIngress={resultIngress}
        resultEgress={resultEgress}
      />
    </>
  );

  return <>{loadAccess(PERMIT_FOUR, auth, module, showData)}</>;
};

export default CheckMoneyPage;
