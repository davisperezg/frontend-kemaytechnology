import { gql, useQuery } from "@apollo/client";

export const GET_RENEWS = gql`
  query getRenews {
    getRenews {
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

export const useGetRenews = () => {
  const { data, error, loading } = useQuery(GET_RENEWS);
  console.log(data);
  return { data, error, loading };
};
