import React from "react";
//dialog
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";

//fullscreen
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { useSelector } from "react-redux";
//icons
import IconButton from "@material-ui/core/IconButton";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";

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

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

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
      disableBackdropClick
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
