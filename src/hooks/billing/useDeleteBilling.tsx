import { gql, useMutation } from "@apollo/client";
import { GET_BILLINGS } from "./useGetBilling";

const DELETE_BILLING = gql`
  mutation deleteBilling($id: String!) {
    deleteBilling(id: $id)
  }
`;

export const useDeleteBilling = () => {
  const [deleteBilling, { error, loading }] = useMutation(DELETE_BILLING, {
    refetchQueries: () => [
      {
        query: GET_BILLINGS,
      },
    ],
  });

  return { deleteBilling, error, loading };
};
