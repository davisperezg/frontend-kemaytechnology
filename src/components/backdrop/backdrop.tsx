import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

interface Options {
  handleClose?: () => void;
  state: boolean;
}

const BackDrop = ({ state, handleClose }: Options) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={state} onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackDrop;
