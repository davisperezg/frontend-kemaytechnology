import { User } from "../../interfaces/user.interface";
import { LOGIN_USER, LOGOUT_USER, RESTA, SUMA } from "./action";

const initialState: User = {
  id: "",
  name: "",
  lastName: "",
  email: "",
};

const istate = {
  amount: 0,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = istate, action: any) => {
  switch (action.type) {
    case SUMA:
      return {
        ...state,
        amount: state.amount + 10,
      };

    case RESTA:
      return {
        ...state,
        amount: state.amount - 10,
      };

    default:
      return state;
  }
};
