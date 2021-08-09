import { gql, useMutation } from "@apollo/client";
import { Billing } from "../../interfaces/billing.interface";
import { GET_BILLINGS } from "./useGetBilling";

interface CreateBillingInput {
  variables: {
    billingInput: Billing;
  };
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
  const [registerBilling, { error, loading }] = useMutation(CREATE_BILLING, {
    refetchQueries: () => [
      {
        query: GET_BILLINGS,
      },
    ],
  });

  return { registerBilling, error, loading };
};
