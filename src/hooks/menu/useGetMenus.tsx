import { gql, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";

export const GET_MENUS = gql`
  query getMenus {
    getMenus {
      id
      name
      link
      createdAt
      updatedAt
    }
  }
`;

export const useGetMenus = () => {
  const { data, error, loading }: any = useQuery(GET_MENUS);
  const dispatch = useDispatch();

  if (error) {
    dispatch(
      setAlert({
        type: "error",
        text: error.message,
      })
    );
  }
  return { data, error, loading };
};
