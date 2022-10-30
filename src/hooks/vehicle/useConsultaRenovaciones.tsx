import { gql } from "@apollo/client";
import { graphQLClient } from "../../config/config";
import { useQuery } from "@tanstack/react-query";

export const GET_CONSULTA_RENOVACIONES_VEHICLE = gql`
  query getVehiculosRenovadosXFecha($desde: DateTime!, $hasta: DateTime!) {
    getVehiculosRenovadosXFecha(desde: $desde, hasta: $hasta) {
      id
      renovationStart
      renovationEnd
      expirationDate
      createdAt
      vehicle {
        plate
        customer {
          id
          name
          lastName
          cellphone_1
          cellphone_2
          numDocument
        }
        device {
          name
        }
        platform
        sim
        nroGPS
        createdAt
        retired
      }
      billing {
        name
        day
      }
    }
  }
`;

export const useConsultaRenovaciones = (range: any) => {
  return useQuery(["cn-renovaciones", range], {
    queryFn: async () => {
      const { getVehiculosRenovadosXFecha } = await graphQLClient.request(
        GET_CONSULTA_RENOVACIONES_VEHICLE,
        {
          desde: range.desde,
          hasta: range.hasta,
        }
      );
      return getVehiculosRenovadosXFecha;
    },

    enabled: false,
    cacheTime: 0,
  });
};
