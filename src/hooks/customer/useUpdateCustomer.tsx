import { gql } from "@apollo/client";
import { Customer } from "../../interfaces/customer.interface";
import { graphQLClient } from "../../config/config";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface IError {
  request: {
    response: string;
  };
}

interface IUpdateParams {
  variables: { customerInput: Customer };
}

const UPDATE_CUSTOMER = gql`
  mutation updateCustomer($customerInput: UpdateCustomerInput!) {
    updateCustomer(customerInput: $customerInput) {
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
    }
  }
`;

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<Customer, IError, IUpdateParams>(["customers"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(UPDATE_CUSTOMER, variables),
    onSuccess() {
      queryClient.invalidateQueries(["customers"]);
    },
  });
};
