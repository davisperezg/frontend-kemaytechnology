import { gql, useMutation } from "@apollo/client";
import { Role } from "../../interfaces/role.interface";

interface RoleUpdateInput {
  variables: {
    roleInput: Role;
  };
}

const UDATE_ROL = gql`
  mutation updateRole($roleInput: RoleUpdateInput!) {
    updateRole(roleInput: $roleInput) {
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

export const useUpdateRole = () => {
  const [updateRole, { error, loading }] = useMutation(UDATE_ROL, {
    update(cache, { data: { updateRole } }) {
      cache.modify({
        fields: {
          updateRole(existingRoles = []) {
            const newRolesRef = cache.writeFragment({
              data: updateRole,
              fragment: gql`
                fragment NewRole on Role {
                  id
                  name
                  description
                  modules {
                    id
                    name
                  }
                }
              `,
            });
            return [...existingRoles, newRolesRef];
          },
        },
      });
    },
  });

  return { updateRole, error, loading };
};
