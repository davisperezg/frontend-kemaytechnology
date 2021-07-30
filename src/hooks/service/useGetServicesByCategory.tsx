import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_SERVICES_BY_CATEGORY = gql`
  query getServicesByCategory($category: String!) {
    getServicesByCategory(category: $category) {
      id
      name
      description
      price
    }
  }
`;

export const useGetServicesByCategory = (category: string) => {
  const { error, loading, data } = useQuery(GET_SERVICES_BY_CATEGORY, {
    variables: { category },
  });

  return { data, error, loading };
};
