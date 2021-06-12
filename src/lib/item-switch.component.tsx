import React, { createElement } from "react";
import { connect } from "react-redux";
import { Redirect, Route, useLocation } from "react-router-dom";
import NoMatch from "../pages/404.page";
import Caja from "../pages/caja.page";
import Clientes from "../pages/clientes.page";
import ModulePage from "../pages/module.page";
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

  console.log(`in link ${link}`);
  console.log(`in formated ${formatedLink}`);

  const PrivateRoute = ({ component, toLogin, ...rest }: any) => {
    const routeComponent = (props: any) => {
      console.log(props);
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
        const HOME = () => <Clientes />;
        return HOME;

      case "MODULOS":
        const MODULOS = () => <ModulePage />;
        return MODULOS;

      case "CLIENTES":
        const CLIENTES = () => <Clientes />;
        return CLIENTES;

      case "CAJA":
        const CAJA = () => <Caja />;
        return CAJA;

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
