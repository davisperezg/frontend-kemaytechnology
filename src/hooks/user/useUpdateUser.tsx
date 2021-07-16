import { gql, useMutation } from "@apollo/client";
import { User } from "../../interfaces/user.interface";
import { GET_USERS } from "./useGetUsers";

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
      role {
        id
        name
      }
    }
  }
`;

export const useUpdateUser = () => {
  const [updateUser, { error, loading }] = useMutation(
    UPDATE_USER
    //   , {
    //   refetchQueries: () => [
    //     {
    //       query: GET_USERS,
    //     },
    //   ],
    // }
  );

  return { updateUser, error, loading };
};
