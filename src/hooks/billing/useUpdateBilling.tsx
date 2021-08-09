import { gql, useMutation } from "@apollo/client";
import { Billing } from "../../interfaces/billing.interface";
import { GET_BILLINGS } from "./useGetBilling";

interface UpdateBillingInput {
  variables: {
    billingInput: Billing;
  };
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
  const [updateBilling, { error, loading }] = useMutation(UPDATE_BILLING, {
    refetchQueries: () => [
      {
        query: GET_BILLINGS,
      },
    ],
  });

  return { updateBilling, error, loading };
};
