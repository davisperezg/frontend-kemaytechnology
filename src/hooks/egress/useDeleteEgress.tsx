import { gql, useMutation } from "@apollo/client";
import { GET_EGRESS } from "./useGetEgress";

const DELETE_EGRESS = gql`
  mutation deleteEgress($id: String!) {
    deleteEgress(id: $id)
  }
`;

export const useDeleteEgress = () => {
  const [deleteEgress, { error, loading }] = useMutation(DELETE_EGRESS, {
    refetchQueries: () => [
      {
        query: GET_EGRESS,
      },
    ],
  });

  return { deleteEgress, error, loading };
};
