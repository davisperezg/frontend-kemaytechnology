import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_BRANDS_BY_CATEGORY = gql`
  query getBrandsByCategory($category: String!) {
    getBrandsByCategory(category: $category) {
      id
      name
    }
  }
`;

export const useGetBrandsByCategory = (category: string) => {
  const { error, loading, data } = useQuery(GET_BRANDS_BY_CATEGORY, {
    variables: { category },
  });

  return { data, error, loading };
};
