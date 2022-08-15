import { gql } from "@apollo/client";
import { Device } from "../../interfaces/device.interface";
import { graphQLClient } from "../../config/config";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface IError {
  request: {
    response: string;
  };
}

interface IUpdateParams {
  variables: { deviceInput: Device };
}

const UPDATE_DEVICE = gql`
  mutation updateDevice($deviceInput: UpdateDeviceInput!) {
    updateDevice(deviceInput: $deviceInput) {
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

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation<Device, IError, IUpdateParams>(["devices"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(UPDATE_DEVICE, variables),
    onSuccess() {
      queryClient.invalidateQueries(["devices"]);
    },
  });
};
