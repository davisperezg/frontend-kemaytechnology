import React from "react";
import Footer from "../footer/footer.component";
import { useHistory } from "react-router-dom";
import SwitchContainer from "../../lib/switch-container";
import "./wrapper.css";

const Wrapper = () => {
  let history = useHistory();

  const url = (param: string) => history.push(`/${param}`);

  return (
    <div className="wrapper">
      <aside>
        <div className="sidebar">
          <ul>
            <li onClick={() => url("caja")}>Caja</li>
            <li onClick={() => url("proformas")}>Proformas</li>
            <li onClick={() => url("test")}>Registro</li>
            <li>Mantenimiento</li>
            <li>Productos</li>
          </ul>
        </div>
      </aside>
      <section className="content-wrapper">
        <div className="content-wrapper-header items-center">
          <h1>Dashboard</h1>
          <ol>
            <li className="list-style-none text-active">
              <strong>Home</strong>
            </li>
            <li className="list-style-none text-inactive">Dashboard</li>
          </ol>
        </div>
        <div className="content-wrapper-main">
          <SwitchContainer />
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default Wrapper;
