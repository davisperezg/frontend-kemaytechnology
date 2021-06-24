import { gql, useQuery } from "@apollo/client";

export const GET_ROLES = gql`
  query getRoles {
    getRoles {
      id
      name
      description
      createdAt
      updatedAt
      modules {
        id
        name
        description
      }
    }
  }
`;

export const useGetRoles = () => {
  const { data, loading, error } = useQuery(GET_ROLES);
  return { data, loading, error };
};
