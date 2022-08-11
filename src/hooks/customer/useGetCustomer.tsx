import { gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

export const GET_CUSTOMERS = gql`
  query {
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
      fecha_nac
    }
  }
`;

export const useGetCustomers = () => {
  return useQuery(["customers"], async () => {
    const { getCustomer } = await graphQLClient.request(GET_CUSTOMERS);

    return getCustomer;
  });
};
