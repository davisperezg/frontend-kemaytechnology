import { gql, useMutation } from "@apollo/client";
import { GET_CUSTOMERS } from "./useGetCustomer";

const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($id: String!) {
    deleteCustomer(id: $id)
  }
`;

export const useDeleteCustomer = () => {
  const [deleteCustomer, { error, loading }] = useMutation(DELETE_CUSTOMER, {
    refetchQueries: () => [
      {
        query: GET_CUSTOMERS,
      },
    ],
  });

  return { deleteCustomer, error, loading };
};
