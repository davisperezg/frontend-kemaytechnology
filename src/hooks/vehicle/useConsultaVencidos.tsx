import { gql } from "@apollo/client";
import { graphQLClient } from "../../config/config";
import { useQuery } from "@tanstack/react-query";

export const GET_CONSULTA_VENCIDOS_VEHICLE = gql`
  query getVehiculosVencidosXFecha($desde: DateTime!, $hasta: DateTime!) {
    getVehiculosVencidosXFecha(desde: $desde, hasta: $hasta) {
      id
      billigStart
      billigEnd
      createdAt
      platform
      plate
      sim
      nroGPS
      billing {
        name
      }
      customer {
        id
        name
        lastName
        cellphone_1
        cellphone_2
        direction
      }
      device {
        name
      }
    }
  }
`;

export const useConsultaVencidos = (range: any) => {
  return useQuery(["cn-vencidos", range], {
    queryFn: async () => {
      const { getVehiculosVencidosXFecha } = await graphQLClient.request(
        GET_CONSULTA_VENCIDOS_VEHICLE,
        {
          desde: range.desde,
          hasta: range.hasta,
        }
      );
      return getVehiculosVencidosXFecha;
    },

    enabled: false,
    cacheTime: 0,
  });
};
