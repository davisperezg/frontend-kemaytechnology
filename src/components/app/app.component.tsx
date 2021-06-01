import { ApolloProvider } from "@apollo/client";
import React from "react";
import { Redirect, BrowserRouter as Router } from "react-router-dom";
import client from "../../apollo-client";
import { getLocal } from "../../lib/local-storage";
import Home from "../../pages/home.page";
import LoginPage from "../../pages/login.page";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        {getLocal("accessToken") ? (
          <Home />
        ) : (
          <>
            <LoginPage />
            <Redirect to="/" />
          </>
        )}
      </Router>
    </ApolloProvider>
  );
};

export default App;
