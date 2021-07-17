import { gql, useMutation } from "@apollo/client";
import { Service } from "../../interfaces/service.interface";
import { GET_SERVICES } from "./useGetServices";

interface CreateServiceInput {
  variables: {
    serviceInput: Service;
  };
}

const CREATE_SERVICE = gql`
  mutation registerService($serviceInput: CreateServiceInput!) {
    registerService(serviceInput: $serviceInput) {
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

//https://stackoverflow.com/questions/58431224/how-does-apollo-client-graphql-refetchqueries-works
export const useCreateService = () => {
  const [registerService, { error, loading }] = useMutation(CREATE_SERVICE, {
    refetchQueries: () => [
      {
        query: GET_SERVICES,
      },
    ],
  });

  return { registerService, error, loading };
};
