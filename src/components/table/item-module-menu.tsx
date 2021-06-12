import React from "react";
import { Menu } from "../../interfaces/menu.interface";
import Chip from "@material-ui/core/Chip";

/**
 * @param columns:any
 * @returns {columns: Array(1)}
 **/

/**
 * @param {columns}:any
 * @returns [{…}]
 **/

const ItemModuleMenu = ({ menu }: { menu: Menu }) => {
  return (
    <>
      <Chip
        style={{ margin: "3px" }}
        size="small"
        label={menu.name}
        onDelete={() => alert("keiner")}
        color="primary"
      />
      &nbsp;
    </>
  );
};
export default ItemModuleMenu;
