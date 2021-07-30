import { gql, useQuery } from "@apollo/client";

const GET_PRODUCTS_BY_CMM = gql`
  query getProductsByCategoryBrandModel(
    $category: String!
    $brand: String!
    $model: String!
  ) {
    getProductsByCategoryBrandModel(
      category: $category
      brand: $brand
      model: $model
    ) {
      id
      name
    }
  }
`;

export const useGetProductsCMM = (
  category: string,
  brand: string,
  model: string
) => {
  const { error, loading, data } = useQuery(GET_PRODUCTS_BY_CMM, {
    variables: {
      category: category,
      brand: brand,
      model: model,
    },
  });

  return { data, error, loading };
};
