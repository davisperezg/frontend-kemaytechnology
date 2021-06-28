/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useMutation } from "@apollo/client";
import { Login } from "../../interfaces/auth.interface";

interface AuthInput {
  variables: {
    authInput: Login;
  };
}

const POST_LOGIN = gql`
  mutation login($authInput: AuthInput!) {
    login(authInput: $authInput) {
      access_token
      refresh_token
    }
  }
`;

export const useLogin = (): any => {
  const [login] = useMutation(POST_LOGIN);

  return login;
};
