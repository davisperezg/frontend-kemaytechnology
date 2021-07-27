import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import RedditTextField from "../components/textfield/reddit";
import moment from "moment";

const CheckMoneyPage = () => {
  const now = moment().utc().local().format("YYYY-MM-DD");
  console.log(now);

  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <RedditTextField
          fullWidth
          type="date"
          //onChange={handleInput}
          name="date-start"
          autoComplete="off"
          id="idStart"
          label="Desde"
          variant="filled"
          value={moment().utc().local().format("YYYY-MM-DD")}
        />
      </Grid>
      <Grid item xs={3}>
        <RedditTextField
          fullWidth
          type="date"
          //onChange={handleInput}
          name="date-start"
          autoComplete="off"
          id="idStart"
          label="Hasta"
          variant="filled"
          value={moment().utc().local().format("YYYY-MM-DD")}
        />
      </Grid>
      <Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
        <Button
          onClick={() => alert("a")}
          variant="contained"
          size="large"
          color="primary"
        >
          Consultar
        </Button>
      </Grid>
    </Grid>
  );
};

export default CheckMoneyPage;
