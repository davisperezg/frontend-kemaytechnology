import { gql, useQuery } from "@apollo/client";

export const GET_SERVICES = gql`
  query getServices {
    getServices {
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
    }
  }
`;

export const useGetServices = () => {
  const { data, error, loading } = useQuery(GET_SERVICES);

  return { data, error, loading };
};
