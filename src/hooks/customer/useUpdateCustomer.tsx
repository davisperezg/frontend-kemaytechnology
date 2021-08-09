import { gql, useMutation } from "@apollo/client";
import { Customer } from "../../interfaces/customer.interface";
import { GET_CUSTOMERS } from "./useGetCustomer";

interface UpdateCustomerInput {
  variables: {
    customerInput: Customer;
  };
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
  const [updateCustomer, { error, loading }] = useMutation(UPDATE_CUSTOMER, {
    refetchQueries: () => [
      {
        query: GET_CUSTOMERS,
      },
    ],
  });

  return { updateCustomer, error, loading };
};
