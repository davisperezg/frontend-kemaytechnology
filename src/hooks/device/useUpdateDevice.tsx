import { gql, useMutation } from "@apollo/client";
import { Device } from "../../interfaces/device.interface";
import { GET_DEVICES } from "./useGetDevice";

interface UpdateDeviceInput {
  variables: {
    deviceInput: Device;
  };
}

const UPDATE_DEVICE = gql`
  mutation updateDevice($deviceInput: UpdateDeviceInput!) {
    updateDevice(deviceInput: $deviceInput) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const useUpdateDevice = () => {
  const [updateDevice, { error, loading }] = useMutation(UPDATE_DEVICE, {
    refetchQueries: () => [
      {
        query: GET_DEVICES,
      },
    ],
  });

  return { updateDevice, error, loading };
};
