import ListItemModules from "../wrapper/list-item-modules";
import logo from "../../assets/logo_kemay_antena.png";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Module } from "../../interfaces/module.interface";
import { User } from "../../interfaces/user.interface";
import { useHistory } from "react-router-dom";
import { setLink } from "../../store/page/action";

import "./aside.css";

const Aside = () => {
  const auth: User = useSelector((state: any) => state.authReducer.authUser);
  const { module, page } = useSelector((state: any) => {
    return state.page.user;
  });
  const findModules = auth?.role?.modules;
  const [modules, setModules] = useState<Module[]>([]);
  const history = useHistory();
  const dispatch = useDispatch();

  const gotToHome = () => {
    history.push(`/`);
    dispatch(setLink("Inicio", "/", "Dashboard"));
  };

  useEffect(() => {
    setModules(findModules || []);
  }, [findModules]);

  return (
    <aside>
      <div className="content-logo">
        <div className="logo" onClick={gotToHome}>
          <img width="100" height="100" src={logo} alt="Logo" />
        </div>
        {/* <div className="title-logo" onClick={gotToHome}>
          <p>KTECH</p>
        </div> */}
      </div>
      <div className="sidebar">
        <ul>
          {modules.map((module) => (
            <ListItemModules key={module.id} module={module} />
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
