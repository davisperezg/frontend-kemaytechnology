import { gql, useQuery } from "@apollo/client";

export const GET_MODELS = gql`
  query getModels {
    getModels {
      id
      name
      brand {
        id
        name
      }
    }
  }
`;

export const useGetModels = () => {
  const { data, error, loading } = useQuery(GET_MODELS);

  return { data, error, loading };
};
