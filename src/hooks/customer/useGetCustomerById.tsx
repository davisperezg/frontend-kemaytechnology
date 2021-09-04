import { gql, useLazyQuery } from "@apollo/client";

const GET_CUSTOM_BY_ID = gql`
  query getCustomerById($id: String!) {
    getCustomerById(id: $id) {
      id
      name
      lastName
      username
      password
    }
  }
`;

export const useGetCustomerById = () => {
  const [getCustomerById, { loading, error, data }] =
    useLazyQuery(GET_CUSTOM_BY_ID);

  return { getCustomerById, loading, error, data };
};
