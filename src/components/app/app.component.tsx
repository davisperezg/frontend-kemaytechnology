import React from "react";
import { Redirect, BrowserRouter as Router } from "react-router-dom";
import { getLocal } from "../../lib/local-storage";
import Home from "../../pages/home.page";
import LoginPage from "../../pages/login.page";

const App: React.FC = () => {
  return (
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
  );
};

export default App;
