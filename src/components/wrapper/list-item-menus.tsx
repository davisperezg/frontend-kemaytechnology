import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { Menu } from "../../interfaces/menu.interface";
import { Module } from "../../interfaces/module.interface";
import { setLink } from "../../store/page/action";

/** #1
 * @param { name, link }: Menu = {}
 * @returns name, link
 **/

/** #2
 * @param { menu }: {menu: Menu}
 * @returns menu.name, menu.link
 **/

/** #3
 * menu:Menu
 * const {name, link} = menu
 * @returns name, link
 **/

const ListItemMenus = ({
  menu,
  setLink,
  module,
}: {
  menu: Menu;
  setLink: any;
  module: Module;
}) => {
  const history = useHistory();

  const goToPage = () => {
    setLink(module.name, menu.link);
    document.title = `RPUM - ${menu.link.toUpperCase()}`;
    history.push(`/${menu.link}`);
  };

  return <li onClick={() => goToPage()}>{menu.name}</li>;
};

export default connect(null, { setLink })(ListItemMenus);
