import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/reducer";
import pageReducer from "./page/reducer";
import alertReducer from "./alert/reducer";

const reducers = combineReducers({
  authReducer,
  page: pageReducer,
  message: alertReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["page"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export const persistor = persistStore(store);
