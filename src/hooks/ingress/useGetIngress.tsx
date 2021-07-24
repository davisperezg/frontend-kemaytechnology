import { gql, useQuery } from "@apollo/client";

export const GET_INGRESS = gql`
  query getIngress {
    getIngress {
      id
      category {
        id
        name
      }
      detail
      observation
      units
      amount
    }
  }
`;

export const useGetIngress = () => {
  const { data, error, loading }: any = useQuery(GET_INGRESS);

  return { data, error, loading };
};
