import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const GET_CONSULTA_VENCIDOS_VEHICLE = gql`
  query getVehiculosVencidosXFecha($desde: DateTime!, $hasta: DateTime!) {
    getVehiculosVencidosXFecha(desde: $desde, hasta: $hasta) {
      id
      billigStart
      billigEnd
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
      }
      device {
        name
      }
    }
  }
`;

export const useConsultaVencidos = () => {
  const [getVehiculosVencidosXFecha, { data, error, loading }] = useLazyQuery(
    GET_CONSULTA_VENCIDOS_VEHICLE
  );

  return { getVehiculosVencidosXFecha, data, error, loading };
};
