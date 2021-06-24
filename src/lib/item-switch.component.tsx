import React, { createElement } from "react";
import { connect } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";
import NoMatch from "../pages/404.page";
import ModulePage from "../pages/module.page";
import RolePage from "../pages/role.page";
import UserPage from "../pages/user.page";
import { getLocal } from "./local-storage";

interface RootState {
  page: {
    user: {
      link: string;
      page: string;
    };
  };
}

const mapStateToProps = (state: RootState) => {
  const {
    page: {
      user: { link, page },
    },
  } = state;
  return { link, page };
};

const ItemSwitch = ({ link, page }: any) => {
  const location = useLocation();
  const formatedLink = location.pathname.replace("/", "");

  const PrivateRoute = ({ component, toLogin, ...rest }: any) => {
    const routeComponent = (props: any) => {
      switch (toLogin) {
        case true:
          return getLocal("accessToken") ? (
            <Redirect to={{ pathname: "/" }} />
          ) : (
            createElement(component, props)
          );

        case false:
          return getLocal("accessToken") ? (
            createElement(component, props)
          ) : (
            <Redirect to={{ pathname: "/" }} />
          );
      }
    };

    return <Route {...rest} render={routeComponent} />;
  };

  const PAGES = (page: string) => {
    switch (page) {
      case "HOME":
        const Home = () => {
          return <h1>Hola Home</h1>;
        };
        return Home;

      case "MODULOS":
        const Modulos = () => <ModulePage />;
        return Modulos;

      case "ROLES":
        const Roles = () => <RolePage />;
        return Roles;

      case "USUARIOS":
        const Usuarios = () => <UserPage />;
        return Usuarios;

      default:
        const ERROR = () => <NoMatch />;
        return ERROR;
    }
  };

  return (
    <>
      {link === formatedLink || link === location.pathname ? (
        <PrivateRoute
          exact
          path={`/${link}`}
          toLogin={false}
          component={PAGES(`${page}`)}
        />
      ) : (
        <PrivateRoute toLogin={false} path="*" component={NoMatch} />
      )}
    </>
  );
};

/**
 *
   {menu.link === formatedLink ? (
        <>
          <Switch>
            <PrivateRoute exact path="/caja" toLogin={false} component={Caja} />
          </Switch>
        </>
      ) : (
        <>
          <Switch>
            <Route path="*" component={NoMatch} />
          </Switch>
        </>
      )}
 * 
 */
export default connect(mapStateToProps, null)(ItemSwitch);