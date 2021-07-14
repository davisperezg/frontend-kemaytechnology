import { gql, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";

export const GET_CATEGORYS = gql`
  query getCategorys {
    getCategorys {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const useGetCategorys = () => {
  const { data, error, loading }: any = useQuery(GET_CATEGORYS);
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
