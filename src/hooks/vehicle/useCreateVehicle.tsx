import { gql, useMutation } from "@apollo/client";
import { Vehicle } from "../../interfaces/vehicle.interface";
import { GET_VEHICLES } from "./useGetVehicle";

interface CreateVehicleInput {
  variables: {
    vehicleInput: Vehicle;
  };
}

const CREATE_DEVICE = gql`
  mutation registerVehicle($vehicleInput: CreateVehicleInput!) {
    registerVehicle(vehicleInput: $vehicleInput) {
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

export const useCreateVehicle = () => {
  const [registerVehicle, { error, loading }] = useMutation(CREATE_DEVICE, {
    refetchQueries: () => [
      {
        query: GET_VEHICLES,
      },
    ],
  });

  return { registerVehicle, error, loading };
};
