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
      createdBy {
        id
        name
      }
      updatedBy {
        id
        name
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
      sim
      platform
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
