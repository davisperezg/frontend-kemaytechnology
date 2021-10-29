import { gql, useQuery } from "@apollo/client";

export const GET_RENEWS = gql`
  query getRenews {
    getRenews {
      id
      registeredBy {
        id
        name
        lastName
      }
      updatedBy {
        id
        name
        lastName
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
      billing {
        id
        name
      }
      expirationDate
      renovationStart
      renovationEnd
      createdAt
      updatedAt
    }
  }
`;

export const useGetRenews = () => {
  const { data, error, loading } = useQuery(GET_RENEWS);
  console.log(data);
  return { data, error, loading };
};
