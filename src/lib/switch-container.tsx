import React, { createElement } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import NoMatch from "../pages/404.page";
import Caja from "../pages/caja.page";
import Test from "../pages/test.page";
import { getLocal } from "./local-storage";

const SwitchContainer = () => {
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

  return (
    <Switch>
      <PrivateRoute exact path="/" toLogin={false} component={Caja} />
      <PrivateRoute path="/proformas" toLogin={false} component={Test} />
      <PrivateRoute path="/caja" toLogin={false} component={Caja} />
      <PrivateRoute path="*" toLogin={false} component={NoMatch} />
    </Switch>
  );
};

export default SwitchContainer;
