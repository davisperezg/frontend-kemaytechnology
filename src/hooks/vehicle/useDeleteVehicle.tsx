import { gql } from "@apollo/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

interface IError {
  request: {
    response: string;
  };
}

interface IDelteParams {
  variables: { id: string };
}

const DELETE_VEHICLE = gql`
  mutation deleteVehicle($id: String!) {
    deleteVehicle(id: $id)
  }
`;

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>({
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(DELETE_VEHICLE, variables),
    onSuccess() {
      queryClient.invalidateQueries(["vehicles"]);
    },
  });
};
