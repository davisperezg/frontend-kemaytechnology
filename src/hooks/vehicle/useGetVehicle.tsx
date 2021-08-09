import { gql, useQuery } from "@apollo/client";

export const GET_VEHICLES = gql`
  query getVehicles {
    getVehicles {
      id
      customer {
        id
        name
        lastName
        document
        numDocument
      }
      device {
        id
        name
      }
      billing {
        id
        name
        day
      }
      plate
      nroGPS
      billigStart
      billigEnd
      createdAt
      updatedAt
    }
  }
`;

export const useGetVehicles = () => {
  const { data, error, loading } = useQuery(GET_VEHICLES);

  return { data, error, loading };
};