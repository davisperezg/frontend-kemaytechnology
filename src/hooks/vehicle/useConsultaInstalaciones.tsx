import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const GET_CONSULTA_INSTALACIONES_VEHICLE = gql`
query getVehiculosInstaladosXrango($desde:DateTime!,$hasta:DateTime!){
    getVehiculosInstaladosXrango (desde:$desde,hasta:$hasta){
      id
      plate
      customer {
        name
        lastName
      }
      billigStart
      billigEnd
      
      device{
        name
      }
      platform
      billing{
        name
      }
      sim
    }
  }
`;

export const useConsultaInstalaciones = () => {
  const [getVehiculosInstaladosXrango,{ data, error, loading }] = useLazyQuery(GET_CONSULTA_INSTALACIONES_VEHICLE);

  return { getVehiculosInstaladosXrango,data, error, loading };
};