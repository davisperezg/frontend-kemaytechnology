import { gql } from "@apollo/client";
import { useQuery } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

const GETONE_DEVICE = gql`
  query getDevice($id: String!) {
    getDevice(id: $id) {
      id
      name
      reference
      commands
      commandsclient
      createdAt
      updatedAt
    }
  }
`;

export const useGetOneDevice = (id: string) => {
  return useQuery(
    ["devices", id],
    async () => {
      const { getDevice } = await graphQLClient.request(GETONE_DEVICE, {
        id,
      });
      return getDevice;
    },
    {
      enabled: !!id,
    }
  );
};
