import { gql, useQuery } from "@apollo/client";

export const GET_DEVICES = gql`
  query getDevices {
    getDevices {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const useGetDevices = () => {
  const { data, error, loading } = useQuery(GET_DEVICES);

  return { data, error, loading };
};
