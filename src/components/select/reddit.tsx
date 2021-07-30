import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { OutlinedInputProps } from "@material-ui/core/OutlinedInput";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStylesReddit = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: "1px solid #e2e2e1",
      overflow: "hidden",
      borderRadius: 4,
      backgroundColor: "#fff",
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

//testing component
const RedditSelect = (props: any) => {
  const classes = useStylesReddit();
  console.log(classes);
  return (
    // <TextField
    //   fullWidth
    //   label="Hasta"
    //   variant="filled"
    //   InputProps={
    //     { classes, disableUnderline: true } as Partial<OutlinedInputProps>
    //   }
    //   {...props}
    // />
    <Autocomplete
      {...props}
      renderInput={() => (
        <TextField
          style={{ backgroundColor: "#fff" }}
          label="Categoria"
          variant="filled"
        />
      )}
      style={{ backgroundColor: "#fcfcfb" }}
    />
  );
};

export default RedditSelect;
