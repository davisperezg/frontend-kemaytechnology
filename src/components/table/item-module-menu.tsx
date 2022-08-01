import React from "react";
import { Menu } from "../../interfaces/menu.interface";
import Chip from "@mui/material/Chip";
import { MENU_FORBIDDEN } from "../../const";

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
      {menu.name === MENU_FORBIDDEN ? (
        <Chip
          style={{ margin: "3px" }}
          size="small"
          label={menu.name}
          color="primary"
        />
      ) : (
        <Chip
          style={{ margin: "3px" }}
          size="small"
          label={menu.name}
          onDelete={() => alert("keiner")}
          color="primary"
        />
      )}
      &nbsp;
    </>
  );
};
export default ItemModuleMenu;
