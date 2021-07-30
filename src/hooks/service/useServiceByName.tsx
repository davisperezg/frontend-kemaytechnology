import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_SERVICE_BY_NAME = gql`
  query getServiceByName($service: String!) {
    getServiceByName(service: $service) {
      id
      name
      description
      price
      createdAt
      updatedAt
    }
  }
`;

export const useGetServiceByName = () => {
  const [getServiceByName, { error, loading, data }] =
    useLazyQuery(GET_SERVICE_BY_NAME);

  return { getServiceByName, data, error, loading };
};
