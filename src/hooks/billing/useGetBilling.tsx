import { gql, useQuery } from "@apollo/client";

export const GET_BILLINGS = gql`
  query getBillings {
    getBillings {
      id
      name
      day
      createdAt
      updatedAt
    }
  }
`;

export const useGetBilling = () => {
  const { data, error, loading } = useQuery(GET_BILLINGS);

  return { data, error, loading };
};
