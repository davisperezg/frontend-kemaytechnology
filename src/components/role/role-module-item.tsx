import React from "react";
import Chip from "@material-ui/core/Chip";
import { Module } from "../../interfaces/module.interface";

const RoleModuleItem = ({ module }: { module: Module }) => {
  return (
    <>
      <Chip
        style={{ margin: "3px" }}
        size="small"
        label={module.name}
        onDelete={() => alert("keiner")}
        color="primary"
      />
      &nbsp;
    </>
  );
};
export default RoleModuleItem;
