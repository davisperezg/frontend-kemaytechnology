import { gql } from "@apollo/client";
import { Vehicle } from "../../interfaces/vehicle.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParams {
  variables: { vehicleInput: Vehicle };
}

const CREATE_DEVICE = gql`
  mutation registerVehicle($vehicleInput: CreateVehicleInput!) {
    registerVehicle(vehicleInput: $vehicleInput) {
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

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation<Vehicle, IError, ICreateParams>(["vehicles"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(CREATE_DEVICE, variables),
    onSuccess(data: any) {
      const { registerVehicle } = data;
      queryClient.setQueryData(["vehicles"], (prevVehicles: any) =>
        prevVehicles.concat(registerVehicle)
      );
      queryClient.invalidateQueries(["vehicles"]);
    },
  });
};
