import { gql, useMutation } from "@apollo/client";
import { GET_VEHICLES } from "./useGetVehicle";

const DELETE_VEHICLE = gql`
  mutation deleteVehicle($id: String!) {
    deleteVehicle(id: $id)
  }
`;

export const useDeleteVehicle = () => {
  const [deleteVehicle, { error, loading }] = useMutation(DELETE_VEHICLE, {
    refetchQueries: () => [
      {
        query: GET_VEHICLES,
      },
    ],
  });

  return { deleteVehicle, error, loading };
};
