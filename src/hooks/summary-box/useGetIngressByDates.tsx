import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_DATE = gql`
  query getIngressByDates($start: String!, $end: String!) {
    getIngressByDates(start: $start, end: $end) {
      id
      detail
      observation
      units
      amount
      createdAt
      updatedAt
      category {
        name
      }
      user {
        name
      }
    }
  }
`;

export const useGetIngressByDate = () => {
  const [getIngressByDates, { error, loading, data }] = useLazyQuery(GET_DATE);

  return { getIngressByDates, data, error, loading };
};
