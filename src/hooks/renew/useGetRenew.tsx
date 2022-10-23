import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";
import { gql } from "@apollo/client";

export const GET_RENEWS = gql`
  query getRenews {
    getRenews {
      id
      expirationDate
      renovationStart
      renovationEnd
      createdAt
      updatedAt
      billing {
        id
        name
      }
      vehicle {
        id
        plate
        nroGPS
        sim
        platform
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
        device {
          name
        }
      }
    }
  }
`;

export const useGetRenews = () => {
  return useQuery(["renews"], async () => {
    const { getRenews } = await graphQLClient.request(GET_RENEWS);

    return getRenews;
  });
};
