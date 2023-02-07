import { gql, useQuery } from "@apollo/client";

export const GET_INGRESS = gql`
  query getIngress {
    getIngress {
      id
      category {
        name
        id
      }
      user {
        name
      }
      detail
      observation
      units
      amount
      createdAt
      updatedAt
    }
  }
`;

export const useGetIngress = () => {
  const { data, error, loading }: any = useQuery(GET_INGRESS);

  return { data, error, loading };
};
