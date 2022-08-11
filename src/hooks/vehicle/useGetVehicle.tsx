import { gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

export const GET_VEHICLES = gql`
  query {
    getVehicles {
      id
      customer {
        id
        name
        lastName
        document
        numDocument
        cellphone_1
        cellphone_2
        username
        password
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
  return useQuery(["vehicles"], async () => {
    const { getVehicles } = await graphQLClient.request(GET_VEHICLES);

    return getVehicles;
  });
};
