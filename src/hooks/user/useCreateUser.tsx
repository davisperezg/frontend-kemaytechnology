import { gql, useMutation } from "@apollo/client";
import { User } from "../../interfaces/user.interface";
import { GET_USERS } from "./useGetUsers";

interface UserInput {
  variables: {
    userInput: User;
  };
}

const CREATE_USER = gql`
  mutation registerUser($userInput: UserInput!) {
    registerUser(userInput: $userInput) {
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

export const useCreateUser = () => {
  const [registerUser, { error, loading }] = useMutation(CREATE_USER, {
    refetchQueries: () => [{ query: GET_USERS }],
  });
  return { registerUser, error, loading };
};
