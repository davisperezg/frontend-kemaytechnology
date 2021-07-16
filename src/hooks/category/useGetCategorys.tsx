import { gql, useQuery } from "@apollo/client";

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

  return { data, error, loading };
};
