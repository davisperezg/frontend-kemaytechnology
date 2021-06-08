import { LINK_USER } from "./action";

interface RootState {
  user: {
    link: string;
    page: string;
  };
}

const initialState = {
  user: {
    link: "/",
    page: "HOME",
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state: RootState = initialState, action: any) => {
  switch (action.type) {
    case LINK_USER:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};
