import React from "react";
//dialog
import { withStyles, Theme, createStyles } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";

//fullscreen
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Alert from "@mui/lab/Alert";
import { useSelector } from "react-redux";
//icons
import IconButton from "@mui/material/IconButton";
import MuiDialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

interface DialogOption {
  open: boolean;
  dialog?: any;
  title: string;
  component?: JSX.Element;
  handleClose: () => void;
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          //className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogForm = ({
  open,
  dialog,
  title,
  component,
  handleClose,
}: DialogOption) => {
  const alert = useSelector((state: any) => state.message);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  /*  https://thoughtbot.com/blog/using-redux-with-react-hooks
    const { count, user } = useSelector(state => ({
      count: state.counter.count,
      user: state.user,
    }));
  */
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      aria-labelledby="idModal"
      disableEscapeKeyDown
    >
      <DialogTitle id="idModal" onClose={handleClose}>
        {title} {dialog?.name}
      </DialogTitle>
      {alert.type && <Alert severity={alert.type}>{alert.text}</Alert>}
      <DialogContent dividers style={{ overflowY: "visible" }}>
        {component}
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
