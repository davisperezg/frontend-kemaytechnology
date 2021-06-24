import { gql, useQuery } from "@apollo/client";

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      name
      lastName
      email
      status
      createdAt
      updatedAt
      role {
        name
        description
        modules {
          access {
            id
            name
          }
        }
      }
    }
  }
`;

export const useGetUsers = () => {
  const { data, loading, error } = useQuery(GET_USERS);

  return { data, loading, error };
};
