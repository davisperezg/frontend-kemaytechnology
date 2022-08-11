import { gql } from "@apollo/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

const DELETE_BILLING = gql`
  mutation deleteBilling($id: String!) {
    deleteBilling(id: $id)
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

export const useDeleteBilling = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>({
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(DELETE_BILLING, variables),
    onSuccess() {
      queryClient.invalidateQueries(["billings"]);
    },
  });
};
