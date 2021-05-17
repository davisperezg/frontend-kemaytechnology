import { ApolloProvider } from "@apollo/client";
import React from "react";
import {
  NavLink,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import client from "../../apollo-client";
import Home from "../../pages/home.page";
import LoginPage from "../../pages/login.page";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <LoginPage />
      {/* <Router>
        <nav>
          <ul>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
            <li>
              <NavLink to="/">Index</NavLink>
            </li>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/home" component={ExchangeRates} />
        </Switch>
      </Router> */}
    </ApolloProvider>
  );
};

export default App;
