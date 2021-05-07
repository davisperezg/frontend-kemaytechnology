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
import { ExchangeRates } from "../../hooks/user/useGet";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Index</NavLink>
            </li>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/home">
            <Home />
            <ExchangeRates />
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
