import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { MENU_FORBIDDEN, ROLSA } from "../../const";
import { Menu } from "../../interfaces/menu.interface";
import { Module } from "../../interfaces/module.interface";
import { setLink } from "../../store/page/action";
import { useSelector } from "react-redux";
import { User } from "../../interfaces/user.interface";

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
  const auth: User = useSelector((state: any) => state.authReducer.authUser);

  const goToPage = () => {
    setLink(module.name, menu.link, menu.name);
    document.title = `RPUM - ${menu.link.toUpperCase()}`;
    history.push(`/${menu.link}`);
  };

  return (
    <>
      {auth?.role?.name === ROLSA ? (
        <li onClick={() => goToPage()}>{menu.name}</li>
      ) : (
        menu.name !== MENU_FORBIDDEN && (
          <li onClick={() => goToPage()}>{menu.name}</li>
        )
      )}
    </>
  );
};

export default connect(null, { setLink })(ListItemMenus);
