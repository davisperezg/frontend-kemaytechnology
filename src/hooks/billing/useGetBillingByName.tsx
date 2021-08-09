import { gql, useLazyQuery } from "@apollo/client";

const BILLING_BY_NAME = gql`
  query getBillingByName($name: String!) {
    getBillingByName(name: $name) {
      id
      name
      day
    }
  }
`;

export const useBillingByName = () => {
  const [getBillingByName, { data, error, loading }] =
    useLazyQuery(BILLING_BY_NAME);

  return { getBillingByName, data, error, loading };
};
