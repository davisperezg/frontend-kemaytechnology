import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import { useHistory } from "react-router-dom";
import "./header.css";
import { clearAllLocal } from "../../lib/local-storage";
import client from "../../apollo-client";
import { User } from "../../interfaces/user.interface";
import { useMe } from "../../hooks/user/useMe";
import { connect } from "react-redux";
import { suma, resta } from "../../store/auth/action";

const initialUser = {
  id: "",
  name: "",
  lastName: "",
  email: "",
};

const mapStateToProps = (state: any) => {
  console.log(state);
  return {
    amount: state.amountReducer.amount,
  };
};

const Header = ({ amount, suma, resta }: any) => {
  let history = useHistory();

  // const logout = () => {
  //   clearAllLocal();
  //   client.resetStore();
  //   window.location.href = "/";
  // };

  const url = (param: string) => history.push(`/${param}`);
  const { loading, data } = useMe();

  return (
    <header>
      <div className="content-logo">
        <div onClick={() => url("")} className="logo">
          <img width="60" height="60" src={logo} alt="Logo" />
        </div>
        <div onClick={() => url("")} className="title-logo">
          <p>RPUM</p>
        </div>
      </div>
      <div className="content-options">
        <div className="options">
          {amount}
          <button className="buttonLogout" onClick={() => suma()}>
            sumar
          </button>
          <button className="buttonLogout" onClick={() => resta()}>
            restar
          </button>
          <a>
            {loading
              ? `Loading...`
              : `Bienvenido, ${data.me.name} ${data.me.lastName}`}
          </a>
          <button className="buttonLogout" onClick={() => alert("hola")}>
            Cerrar sesion
          </button>
        </div>
      </div>
    </header>
  );
};

export default connect(mapStateToProps, { suma, resta })(Header);
