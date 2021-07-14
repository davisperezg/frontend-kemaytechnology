import { gql, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setAlert } from "../../store/alert/action";

const GET_BRANDS = gql`
  query getBrands {
    getBrands {
      id
      name
      createdAt
      updatedAt
      categorys {
        id
        name
        createdAt
        updatedAt
      }
    }
  }
`;

export const useGetBrands = () => {
  const { data, error, loading }: any = useQuery(GET_BRANDS);
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
