/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import { useMe } from "../../hooks/user/useMe";
import { connect } from "react-redux";
import { whoisme, setLoading, logout } from "../../store/auth/action";
import { setLink } from "../../store/page/action";
import { useHistory } from "react-router-dom";
import "./header.css";

const mapStateToProps = (state: any) => {
  return {
    loading: state.authReducer.loading,
    authUser: state.authReducer.authUser,
  };
};

const Header = ({ authUser, loading, whoisme, setLink, logout }: any) => {
  const { me, data } = useMe();
  const history = useHistory();

  const gotToHome = () => {
    history.push(`/`);
    setLink("/");
  };

  useEffect(() => {
    me();
    whoisme(data);
  }, [me, whoisme, data]);

  return (
    <header>
      <div className="content-logo">
        <div onClick={() => gotToHome()} className="logo">
          <img width="60" height="60" src={logo} alt="Logo" />
        </div>
        <div onClick={() => gotToHome()} className="title-logo">
          <p>RPUM</p>
        </div>
      </div>
      <div className="content-options">
        <div className="options">
          <a>
            {loading
              ? `Cargando usuario...`
              : `Bienvenido, ${authUser?.name} ${authUser?.lastName}`}
          </a>

          <button className="buttonLogout" onClick={() => logout()}>
            Cerrar sesion
          </button>
        </div>
      </div>
    </header>
  );
};

export default connect(mapStateToProps, {
  setLoading,
  whoisme,
  logout,
  setLink,
})(Header);
