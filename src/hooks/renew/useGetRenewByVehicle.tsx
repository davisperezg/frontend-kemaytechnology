import { gql } from "@apollo/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

const GETONE_RENEW_BY_PLATE = gql`
  query getRenewByPlate($id: String!) {
    getRenewByPlate(id: $id) {
      id
      status
      expirationDate
      renovationStart
      renovationEnd
      createdAt
      updatedAt
      billingPayToday
      billingDes
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

export const useGetOneRenewPlate = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery(
    ["vehicles", id],
    {
      queryFn: async () => {
        const { getRenewByPlate } = await graphQLClient.request(
          GETONE_RENEW_BY_PLATE,
          {
            id,
          }
        );
        return getRenewByPlate;
      },

      enabled: !!id,
    }

    // async () => {
    //   const { getRenewByPlate } = await graphQLClient.request(
    //     GETONE_RENEW_BY_PLATE,
    //     {
    //       id,
    //     }
    //   );
    //   return getRenewByPlate;
    // },
  );
};
