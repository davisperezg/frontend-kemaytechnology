import { gql, useMutation } from "@apollo/client";
import { Service } from "../../interfaces/service.interface";
import { GET_SERVICES } from "./useGetServices";

interface UpdateServiceInput {
  variables: {
    serviceInput: Service;
  };
}

const UPDATE_SERVICE = gql`
  mutation updateService($serviceInput: UpdateServiceInput!) {
    updateService(serviceInput: $serviceInput) {
      id
      name
      description
      price
      category {
        id
        name
      }
    }
  }
`;

export const useUpdateService = () => {
  const [updateService, { error, loading }] = useMutation(UPDATE_SERVICE, {
    refetchQueries: () => [
      {
        query: GET_SERVICES,
      },
    ],
  });

  return { updateService, error, loading };
};
