import { gql } from "@apollo/client";
import { graphQLClient } from "../../config/config";
import { useQuery } from "@tanstack/react-query";

export const GET_CONSULTA_INSTALACIONES_VEHICLE = gql`
  query getVehiculosInstaladosXrango($desde: DateTime!, $hasta: DateTime!) {
    getVehiculosInstaladosXrango(desde: $desde, hasta: $hasta) {
      id
      plate
      customer {
        id
        name
        lastName
        cellphone_1
        cellphone_2
        direction
      }
      createdAt
      billigStart
      billigEnd
      retired
      device {
        name
      }
      platform
      billing {
        name
      }
      sim
      nroGPS
    }
  }
`;

export const useConsultaInstalaciones = (range: any) => {
  return useQuery(["cn-instalaciones", range], {
    queryFn: async () => {
      const { getVehiculosInstaladosXrango } = await graphQLClient.request(
        GET_CONSULTA_INSTALACIONES_VEHICLE,
        {
          desde: range.desde,
          hasta: range.hasta,
        }
      );
      return getVehiculosInstaladosXrango;
    },

    enabled: false,
    cacheTime: 0,
  });
};
