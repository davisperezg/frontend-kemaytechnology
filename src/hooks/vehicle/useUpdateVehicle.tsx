import { gql, useMutation } from "@apollo/client";
import { Vehicle } from "../../interfaces/vehicle.interface";
import { GET_VEHICLES } from "./useGetVehicle";

interface UpdateVehicleInput {
  variables: {
    vehicleInput: Vehicle;
  };
}

const UPDATE_DEVICE = gql`
  mutation updateVehicle($vehicleInput: UpdateVehicleInput!) {
    updateVehicle(vehicleInput: $vehicleInput) {
      id
      customer {
        id
        name
      }
      device {
        id
        name
      }
      billing {
        id
        name
      }
      plate
      nroGPS
      billigStart
      billigEnd
      createdAt
      updatedAt
    }
  }
`;

export const useUpdateVehicle = () => {
  const [updateVehicle, { error, loading }] = useMutation(UPDATE_DEVICE, {
    refetchQueries: () => [
      {
        query: GET_VEHICLES,
      },
    ],
  });

  return { updateVehicle, error, loading };
};
