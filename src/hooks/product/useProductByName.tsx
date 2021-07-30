import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_PRODUCTS_BY_NAME = gql`
  query getProductByName($product: String!) {
    getProductByName(product: $product) {
      id
      name
      description
      price
      createdAt
      updatedAt
    }
  }
`;

export const useGetProductByName = () => {
  const [getProductByName, { error, loading, data }] =
    useLazyQuery(GET_PRODUCTS_BY_NAME);

  return { getProductByName, data, error, loading };
};
