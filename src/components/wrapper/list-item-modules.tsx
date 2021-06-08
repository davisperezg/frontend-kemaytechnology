import React, { useState, useEffect } from "react";
import { ChevronRight, ExpandMore } from "@material-ui/icons";
import ListItemMenus from "./list-item-menus";
import { Menu } from "../../interfaces/menu.interface";
import { Module } from "../../interfaces/module.interface";

const ListItemModules = ({ module }: { module: Module }) => {
  const [isArrowActive, setArrowActive] = useState<Boolean>(false);
  const [isTextModuleActive, setTextModuleActive] = useState<Boolean>(false);
  const findMenus = module.menus;
  const [menus, setMenu] = React.useState<Menu[]>([]);

  const handleArrow = () => {
    setArrowActive(!isArrowActive);
    setTextModuleActive(!isTextModuleActive);
  };

  const stylesModuleActive = {
    color: "#fff",
    fontWeight: "bold",
  };

  const stylesModuleInactive = {
    color: "#67677e",
  };

  useEffect(() => {
    setMenu(findMenus || []);
  }, [findMenus]);

  return (
    <>
      <li
        style={isTextModuleActive ? stylesModuleActive : stylesModuleInactive}
        onClick={() => handleArrow()}
      >
        {module.name} {isArrowActive ? <ExpandMore /> : <ChevronRight />}
      </li>
      {isArrowActive && (
        <ul>
          {menus.map((menu) => (
            <ListItemMenus key={menu.id} menu={menu} />
          ))}
        </ul>
      )}
    </>
  );
};

export default ListItemModules;
