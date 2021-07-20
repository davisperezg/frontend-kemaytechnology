import { gql, useQuery } from "@apollo/client";

const GET_MODELS_BY_BRAND = gql`
  query getModelsByBrand($brand: String!) {
    getModelsByBrand(brand: $brand) {
      id
      name
    }
  }
`;

export const useGetModelsByBrand = (brand: string) => {
  const { error, loading, data } = useQuery(GET_MODELS_BY_BRAND, {
    variables: { brand },
  });

  return { data, error, loading };
};
