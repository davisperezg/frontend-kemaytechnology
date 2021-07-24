import { gql, useMutation } from "@apollo/client";
import { GET_INGRESS } from "./useGetIngress";

const DELETE_INGRESS = gql`
  mutation deleteIngress($id: String!) {
    deleteIngress(id: $id)
  }
`;

export const useDeleteIngress = () => {
  const [deleteIngress, { error, loading }] = useMutation(DELETE_INGRESS, {
    refetchQueries: () => [
      {
        query: GET_INGRESS,
      },
    ],
  });

  return { deleteIngress, error, loading };
};
