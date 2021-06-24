import { gql, useMutation } from "@apollo/client";
import { User } from "../../interfaces/user.interface";

interface UserUpdateInput {
  variables: {
    userInput: User;
  };
}

const UPDATE_USER = gql`
  mutation updateRole($userInput: UserUpdateInput!) {
    updateUser(userInput: $userInput) {
      id
      name
      lastName
      email
      createdAt
      updatedAt
      role {
        name
      }
    }
  }
`;

export const useUpdateUser = () => {
  const [updateUser, { error, loading }] = useMutation(UPDATE_USER, {
    update(cache, { data: { updateUser } }) {
      cache.modify({
        fields: {
          updateUser(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: updateUser,
              fragment: gql`
                fragment NewUser on User {
                  id
                  name
                  lastName
                  email
                  createdAt
                  updatedAt
                  role {
                    name
                  }
                }
              `,
            });
            return [...existingUsers, newUserRef];
          },
        },
      });
    },
  });

  return { updateUser, error, loading };
};
