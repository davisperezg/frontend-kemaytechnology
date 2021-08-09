import { gql, useMutation } from "@apollo/client";
import { Device } from "../../interfaces/device.interface";
import { GET_DEVICES } from "./useGetDevice";

interface CreateDeviceInput {
  variables: {
    deviceInput: Device;
  };
}

const CREATE_DEVICE = gql`
  mutation registerDevice($deviceInput: CreateDeviceInput!) {
    registerDevice(deviceInput: $deviceInput) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const useCreateDevice = () => {
  const [registerDevice, { error, loading }] = useMutation(CREATE_DEVICE, {
    refetchQueries: () => [
      {
        query: GET_DEVICES,
      },
    ],
  });

  return { registerDevice, error, loading };
};
