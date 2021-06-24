import { gql, useQuery } from "@apollo/client";

const GET_USER = gql`
  query getUser($id: String!) {
    getUser(id: $id) {
      id
      name
      lastName
      email
    }
  }
`;

export const useGetUser = (id: string) => {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: id },
  });

  return { loading, error, data };
};
