export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const SUMA = "AMOUNT";
export const RESTA = "RESTA";

export const suma = () => {
  return {
    type: SUMA,
  };
};

export const resta = () => {
  return {
    type: RESTA,
  };
};
