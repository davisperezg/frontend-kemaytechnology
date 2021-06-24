import { gql, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";

const GET_ACCESS = gql`
  query getAccess {
    getAccess {
      id
      name
    }
  }
`;

export const useGetAllAccess = () => {
  const { data, error, loading }: any = useQuery(GET_ACCESS);
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
