import React from "react";
import Chip from "@material-ui/core/Chip";
import { Access } from "../../interfaces/access.interface";
/**
 * @param columns:any
 * @returns {columns: Array(1)}
 **/

/**
 * @param {columns}:any
 * @returns [{…}]
 **/

const ItemModuleAccess = ({ access }: { access: Access }) => {
  return (
    <>
      <Chip
        style={{ margin: "3px" }}
        size="small"
        label={access.name}
        onDelete={() => alert("keiner")}
        color="primary"
      />
    </>
  );
};
export default ItemModuleAccess;
