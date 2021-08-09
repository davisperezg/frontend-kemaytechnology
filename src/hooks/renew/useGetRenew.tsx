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

  return { data, error, loading };
};