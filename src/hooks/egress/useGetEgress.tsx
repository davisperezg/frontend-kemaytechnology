import { gql, useQuery } from "@apollo/client";

export const GET_EGRESS = gql`
  query getEgress {
    getEgress {
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

export const useGetEgress = () => {
  const { data, error, loading }: any = useQuery(GET_EGRESS);

  return { data, error, loading };
};
