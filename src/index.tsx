import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app/app.component";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { store, persistor } from "./store/index";
import { PersistGate } from "redux-persist/integration/react";
import client from "./apollo-client";
import "./pages/css/index.css";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
