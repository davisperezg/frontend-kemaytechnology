import React from "react";
import { Switch } from "react-router-dom";
import ItemSwitch from "./item-switch.component";

const SwitchContainer = () => {
  return (
    <Switch>
      <ItemSwitch />
    </Switch>
  );
};

export default SwitchContainer;
