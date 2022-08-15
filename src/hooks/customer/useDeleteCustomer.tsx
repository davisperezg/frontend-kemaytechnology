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

const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($id: String!) {
    deleteCustomer(id: $id)
  }
`;

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>({
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(DELETE_CUSTOMER, variables),
    onSuccess() {
      queryClient.invalidateQueries(["customers"]);
    },
  });
};
