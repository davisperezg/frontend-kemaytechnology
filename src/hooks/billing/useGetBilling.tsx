import { gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

export const GET_BILLINGS = gql`
  query {
    getBillings {
      id
      name
      day
      createdAt
      updatedAt
      price
    }
  }
`;

export const useGetBilling = () => {
  return useQuery(["billings"], async () => {
    const { getBillings } = await graphQLClient.request(GET_BILLINGS);

    return getBillings;
  });
};
