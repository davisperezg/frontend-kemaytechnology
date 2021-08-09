import { gql, useMutation } from "@apollo/client";
import { GET_DEVICES } from "./useGetDevice";

const DELETE_DEVICE = gql`
  mutation deleteDevice($id: String!) {
    deleteDevice(id: $id)
  }
`;

export const useDeleteDevice = () => {
  const [deleteDevice, { error, loading }] = useMutation(DELETE_DEVICE, {
    refetchQueries: () => [
      {
        query: GET_DEVICES,
      },
    ],
  });

  return { deleteDevice, error, loading };
};
