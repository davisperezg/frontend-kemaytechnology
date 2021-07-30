import { gql, useQuery, useLazyQuery } from "@apollo/client";

const GET_DATE = gql`
  query getEgressByDates($start: String!, $end: String!) {
    getEgressByDates(start: $start, end: $end) {
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
    }
  }
`;

export const useGetEgressByDate = () => {
  const [getEgressByDates, { error, loading, data }] = useLazyQuery(GET_DATE);

  return { getEgressByDates, data, error, loading };
};
