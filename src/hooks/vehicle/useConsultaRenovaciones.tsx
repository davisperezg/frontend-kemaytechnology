import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const GET_CONSULTA_RENOVACIONES_VEHICLE = gql`
  query getVehiculosRenovadosXFecha($desde: DateTime!, $hasta: DateTime!) {
    getVehiculosRenovadosXFecha(desde: $desde, hasta: $hasta) {
      id
      renovationStart
      renovationEnd
      expirationDate
      vehicle {
        plate
        customer {
          name
          lastName
        }
        device {
          name
        }
        platform
        sim
      }
      billing {
        name
      }
    }
  }
`;

export const useConsultaRenovaciones = () => {
  const [getVehiculosRenovadosXFecha, { data, error, loading }] = useLazyQuery(
    GET_CONSULTA_RENOVACIONES_VEHICLE
  );

  return { getVehiculosRenovadosXFecha, data, error, loading };
};
