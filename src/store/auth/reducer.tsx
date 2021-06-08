import { LOADING_USER, ERROR_USER, LOGIN_USER, LOGOUT_USER } from "./action";

interface RootState {
  loading: boolean;
  authUser: undefined;
  error: undefined;
}

const initialState: RootState = {
  loading: false,
  authUser: undefined,
  error: undefined,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state: RootState = initialState, action: any) => {
  switch (action.type) {
    case LOADING_USER:
      return {
        ...state,
        loading: action.payload,
      };

    case LOGIN_USER:
      return {
        ...state,
        authUser: action.payload,
      };

    case LOGOUT_USER:
      return {
        ...state,
        authUser: action.payload,
      };

    case ERROR_USER:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
