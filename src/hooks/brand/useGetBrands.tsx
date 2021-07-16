import { gql, useQuery } from "@apollo/client";

export const GET_BRANDS = gql`
  query getBrands {
    getBrands {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

export const useGetBrands = () => {
  const { data, error, loading } = useQuery(GET_BRANDS);

  return { data, error, loading };
};
