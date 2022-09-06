import { gql } from "@apollo/client";
import { Vehicle } from "../../interfaces/vehicle.interface";
import { graphQLClient } from "../../config/config";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface IError {
  request: {
    response: string;
  };
}

interface IUpdateParams {
  variables: { vehicleInput: Vehicle };
}

const UPDATE_DEVICE = gql`
  mutation updateVehicle($vehicleInput: UpdateVehicleInput!) {
    updateVehicle(vehicleInput: $vehicleInput) {
      id
      customer {
        id
        name
        lastName
        document
        numDocument
      }
      createdBy {
        id
        name
      }
      updatedBy {
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
      sim
      platform
      plate
      nroGPS
      billigStart
      billigEnd
      createdAt
      updatedAt
      retired
    }
  }
`;

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<Vehicle, IError, IUpdateParams>(["vehicles"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(UPDATE_DEVICE, variables),
    onSuccess() {
      queryClient.invalidateQueries(["vehicles"]);
    },
  });
};
