import { gql, useQuery } from "@apollo/client";

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      description
      price
      createdAt
      updatedAt
      category {
        id
        name
      }
      brand {
        id
        name
      }
      model {
        id
        name
      }
    }
  }
`;

export const useGetProducts = () => {
  const { data, error, loading } = useQuery(GET_PRODUCTS);

  return { data, error, loading };
};