import { createStore, combineReducers } from "redux";
import amountReducer from "./auth/reducer";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const reducers = combineReducers({
  amountReducer,
});

const store = createStore(reducers, composeEnhancers);

export default store;
