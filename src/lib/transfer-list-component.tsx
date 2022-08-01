import React from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Progress from "../components/progress/progress";

function not(a: any[], b: any[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: any[], b: any[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: any[], b: any[]) {
  return [...a, ...not(b, a)];
}

const TrasnferList = ({
  setListAvailable,
  setListCurrent,
  listAvailable,
  setChecked,
  checked,
  titleAvailable,
  listCurrent,
  titleCurrent,
  loading,
}: any) => {
  const leftChecked = intersection(checked, listAvailable);
  const rightChecked = intersection(checked, listCurrent);

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: any[]) => intersection(checked, items).length;

  const handleToggleAll = (items: any[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setListCurrent(listCurrent.concat(leftChecked));
    setListAvailable(not(listAvailable, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setListAvailable(listAvailable.concat(rightChecked));
    setListCurrent(not(listCurrent, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: any[]) => (
    <Card>
      <CardHeader
        //className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        //className={classes.list}
        dense
        component="div"
        role="list"
      >
        {loading ? (
          <Progress />
        ) : (
          items.map((value: any) => {
            const labelId = `transfer-list-all-item-${value.name}-label`;

            return (
              <ListItem
                key={value.id}
                role="listitem"
                button
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value.name}`} />
              </ListItem>
            );
          })
        )}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid>
      <Grid item>{customList(titleAvailable, listAvailable)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(titleCurrent, listCurrent)}</Grid>
    </Grid>
  );
};

export default TrasnferList;
