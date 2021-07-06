import React from "react";
import Chip from "@material-ui/core/Chip";
import { Module } from "../../interfaces/module.interface";
import { MODULE_FORBIDDEN } from "../../const";

const RoleModuleItem = ({ module }: { module: Module }) => {
  return (
    <>
      {module.name === MODULE_FORBIDDEN ? (
        <Chip
          style={{ margin: "3px" }}
          size="small"
          label={module.name}
          color="primary"
        />
      ) : (
        <Chip
          style={{ margin: "3px" }}
          size="small"
          label={module.name}
          onDelete={() => alert("keiner")}
          color="primary"
        />
      )}
      &nbsp;
    </>
  );
};
export default RoleModuleItem;
