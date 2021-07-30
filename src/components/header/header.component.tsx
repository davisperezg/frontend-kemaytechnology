/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect } from "react";
import { useMe } from "../../hooks/user/useMe";
import { connect } from "react-redux";
import { whoisme, setLoading, logout } from "../../store/auth/action";
import { setLocal } from "../../lib/local-storage";
import "./header.css";

const mapStateToProps = (state: any) => {
  return {
    loading: state.authReducer.loading,
    authUser: state.authReducer.authUser,
  };
};

const Header = ({ authUser, loading, whoisme, logout }: any) => {
  const { me, data } = useMe();

  useEffect(() => {
    me();
    whoisme(data);
    setLocal("username", data?.me?.email);
  }, [me, whoisme, data]);

  if (data?.me?.status === 2) {
    logout();
  }

  return (
    <header>
      <a>
        {loading ? (
          `Cargando usuario...`
        ) : (
          <>
            <strong>Bienvenido, </strong>
            {authUser?.name} {authUser?.lastName}
          </>
        )}
      </a>
      &nbsp;&nbsp;
      <button className="buttonLogout" onClick={() => logout()}>
        Cerrar sesion
      </button>
    </header>
  );
};

export default connect(mapStateToProps, {
  setLoading,
  whoisme,
  logout,
})(Header);
