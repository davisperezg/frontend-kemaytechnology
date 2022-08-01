import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

interface Options {
  handleClose?: () => void;
  state: boolean;
}

const BackDrop = ({ state, handleClose }: Options) => {
  //const classes = useStyles();
  return (
    <Backdrop open={state} onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackDrop;
