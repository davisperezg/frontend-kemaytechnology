import { gql, useQuery } from "@apollo/client";

export const GET_VEHICLE_RENOVACIONES = gql`
  query getVehiculosRenovados{
    getVehiculosRenovados {
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

export const useVehiculeRenovados= () => {
  const { data, error, loading }= useQuery(
    GET_VEHICLE_RENOVACIONES
  );
  
  return { data, error, loading };

};
