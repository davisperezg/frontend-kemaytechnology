import { gql } from "@apollo/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";
import { Billing } from "../../interfaces/billing.interface";

interface IError {
  request: {
    response: string;
  };
}

interface IUpdateParams {
  variables: { billingInput: Billing };
}

const UPDATE_BILLING = gql`
  mutation updateBilling($billingInput: UpdateBillingInput!) {
    updateBilling(billingInput: $billingInput) {
      id
      name
      day
      createdAt
      updatedAt
    }
  }
`;

export const useUpdateBilling = () => {
  const queryClient = useQueryClient();

  return useMutation<Billing, IError, IUpdateParams>(["billings"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(UPDATE_BILLING, variables),
    onSuccess() {
      queryClient.invalidateQueries(["billings"]);
    },
  });
};
