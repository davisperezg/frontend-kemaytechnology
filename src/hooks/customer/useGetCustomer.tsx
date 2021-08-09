import { gql, useQuery } from "@apollo/client";

export const GET_CUSTOMERS = gql`
  query getCustomer {
    getCustomer {
      id
      name
      lastName
      document
      numDocument
      cellphone_1
      cellphone_2
      direction
      username
      password
      createdAt
      updatedAt
    }
  }
`;

export const useGetCustomers = () => {
  const { data, error, loading } = useQuery(GET_CUSTOMERS);

  return { data, error, loading };
};
