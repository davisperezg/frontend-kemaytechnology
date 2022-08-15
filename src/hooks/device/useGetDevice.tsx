import { gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

export const GET_DEVICES = gql`
  query {
    getDevices {
      id
      name
      reference
      createdAt
      updatedAt
    }
  }
`;

export const useGetDevices = () => {
  return useQuery(["devices"], async () => {
    const { getDevices } = await graphQLClient.request(GET_DEVICES);

    return getDevices;
  });
};
