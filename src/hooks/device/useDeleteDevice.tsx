import { gql } from "@apollo/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

const DELETE_DEVICE = gql`
  mutation deleteDevice($id: String!) {
    deleteDevice(id: $id)
  }
`;

interface IError {
  request: {
    response: string;
  };
}

interface IDelteParams {
  variables: { id: string };
}

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>({
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(DELETE_DEVICE, variables),
    onSuccess() {
      queryClient.invalidateQueries(["devices"]);
    },
  });
};
