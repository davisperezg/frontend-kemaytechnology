import { gql, useMutation } from "@apollo/client";
import { Role } from "../../interfaces/role.interface";
import { GET_ROLES } from "./useGetRoles";

interface RoleInput {
  variables: {
    roleInput: Role;
  };
}

const CREATE_ROL = gql`
  mutation registerRole($roleInput: RoleInput!) {
    registerRole(roleInput: $roleInput) {
      id
      name
      description
      modules {
        id
        name
      }
    }
  }
`;

//https://stackoverflow.com/questions/58431224/how-does-apollo-client-graphql-refetchqueries-works
export const useCreateRole = () => {
  const [registerRole, { error, loading }] = useMutation(CREATE_ROL, {
    refetchQueries: () => [
      {
        query: GET_ROLES,
      },
    ],
  });

  return { registerRole, error, loading };
};
