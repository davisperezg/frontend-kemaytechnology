import { gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

const GETONE_RENEW = gql`
  query getRenewById($id: String!) {
    getRenewById(id: $id) {
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

export const useGetOneRenew = (id: string) => {
  return useQuery(
    ["renews", id],
    async () => {
      const { getDevice } = await graphQLClient.request(GETONE_RENEW, {
        id,
      });
      return getDevice;
    },
    {
      enabled: !!id,
    }
  );
};
