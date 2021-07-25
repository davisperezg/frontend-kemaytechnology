import { gql, useMutation } from "@apollo/client";
import { GET_SERVICES } from "./useGetServices";

const DELETE_SERVICE = gql`
  mutation deleteService($id: String!) {
    deleteService(id: $id)
  }
`;

export const useDeleteService = () => {
  const [deleteService, { error, loading }] = useMutation(DELETE_SERVICE, {
    refetchQueries: () => [
      {
        query: GET_SERVICES,
      },
    ],
  });

  return { deleteService, error, loading };
};
