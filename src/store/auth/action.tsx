/* eslint-disable @typescript-eslint/no-unused-vars */
import { clearAllLocal } from "../../lib/local-storage";
import client from "../../apollo-client";

export const LOGIN_USER = "@auth/LOGIN_USER";
export const LOGOUT_USER = "@auth/LOGOUT_USER";
export const LOADING_USER = "@auth/LOADING_USER";
export const ERROR_USER = "@auth/ERROR_USER";

const initialValue = {
  name: "Anonimo",
  lastName: "",
};

export const setLoading = (loading: boolean) => {
  return {
    type: LOADING_USER,
    payload: loading,
  };
};

export const logout = () => async (dispatch: any) => {
  clearAllLocal();
  client.resetStore();
  window.location.href = "/";
  await dispatch({
    type: LOGOUT_USER,
    payload: initialValue,
  });
};

export const whoisme = (payload: any) => async (dispatch: any) => {
  try {
    await dispatch(setLoading(true));
    await dispatch({
      type: LOGIN_USER,
      payload: payload.me,
    });
    await dispatch(setLoading(false));
  } catch (e: any) {
    await dispatch({
      type: ERROR_USER,
      payload: e.message,
    });
  }
};
