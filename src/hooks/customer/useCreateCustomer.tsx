import { gql, useMutation } from "@apollo/client";
import { Customer } from "../../interfaces/customer.interface";
import { GET_CUSTOMERS } from "./useGetCustomer";

interface CreateCustomerInput {
  variables: {
    customerInput: Customer;
  };
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
    }
  }
`;

export const useCreateCustomer = () => {
  const [registerCustomer, { error, loading }] = useMutation(CREATE_CUSTOMER, {
    refetchQueries: () => [
      {
        query: GET_CUSTOMERS,
      },
    ],
  });

  return { registerCustomer, error, loading };
};
