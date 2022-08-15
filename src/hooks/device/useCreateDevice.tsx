import { gql } from "@apollo/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";
import { Device } from "../../interfaces/device.interface";

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParams {
  variables: { deviceInput: Device };
}

const CREATE_DEVICE = gql`
  mutation registerDevice($deviceInput: CreateDeviceInput!) {
    registerDevice(deviceInput: $deviceInput) {
      id
      name
      reference
      createdAt
      updatedAt
      commands
      commandsclient
    }
  }
`;

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<Device, IError, ICreateParams>(["devices"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(CREATE_DEVICE, variables),
    onSuccess(data: any) {
      const { registerDevice } = data;
      queryClient.setQueryData(["devices"], (prevDevices: any) =>
        prevDevices.concat(registerDevice)
      );
      queryClient.invalidateQueries(["devices"]);
    },
  });
};
