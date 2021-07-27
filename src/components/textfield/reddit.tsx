import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

const useStylesReddit = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: "1px solid #e2e2e1",
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "#fcfcfb",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      "&:hover": {
        backgroundColor: "#fff",
      },
      "&$focused": {
        backgroundColor: "#fff",
        //boxShadow: `${apha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.primary.main,
      },
    },
    focused: {},
  })
);

const RedditTextField = (props: TextFieldProps) => {
  const classes = useStylesReddit();

  return (
    <TextField
      InputProps={
        { classes, disableUnderline: true } as Partial<OutlinedInputProps>
      }
      {...props}
    />
  );
};

export default RedditTextField;
