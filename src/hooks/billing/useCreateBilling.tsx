import { gql } from "@apollo/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";
import { Billing } from "../../interfaces/billing.interface";

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParams {
  variables: { billingInput: Billing };
}

const CREATE_BILLING = gql`
  mutation registerBilling($billingInput: CreateBillingInput!) {
    registerBilling(billingInput: $billingInput) {
      id
      name
      day
      createdAt
      updatedAt
    }
  }
`;

export const useCreateBilling = () => {
  const queryClient = useQueryClient();

  return useMutation<Billing, IError, ICreateParams>(["billings"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(CREATE_BILLING, variables),
    onSuccess(data: any) {
      const { registerBilling } = data;
      queryClient.setQueryData(["billings"], (prevBillings: any) =>
        prevBillings.concat(registerBilling)
      );
      queryClient.invalidateQueries(["billings"]);
    },
  });
};
