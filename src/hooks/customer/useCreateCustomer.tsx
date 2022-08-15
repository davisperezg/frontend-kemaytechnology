import { gql } from "@apollo/client";
import { Customer } from "../../interfaces/customer.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParams {
  variables: { customerInput: Customer };
}

const CREATE_CUSTOMER = gql`
  mutation registerCustomer($customerInput: CreateCustomerInput!) {
    registerCustomer(customerInput: $customerInput) {
      id
      name
      lastName
      document
      numDocument
      cellphone_1
      cellphone_2
      direction
      username
      password
      createdAt
      updatedAt
      fecha_nac
    }
  }
`;

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<Customer, IError, ICreateParams>(["customers"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(CREATE_CUSTOMER, variables),
    onSuccess(data: any) {
      const { registerCustomer } = data;
      queryClient.setQueryData(["customers"], (prevDevices: any) =>
        prevDevices.concat(registerCustomer)
      );
      queryClient.invalidateQueries(["customers"]);
    },
  });
};
