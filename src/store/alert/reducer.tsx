import { IAlert } from "../../interfaces/alert.interface";
import { ALERT } from "./action";

interface RootState {
  alert: IAlert;
}

const initialState: RootState = {
  alert: {
    type: "",
    text: "",
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state: any = initialState, action: any) => {
  switch (action.type) {
    case ALERT:
      return action.payload;

    default:
      return state;
  }
};
