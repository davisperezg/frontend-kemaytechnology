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
  const [login] = useMutation(POST_LOGIN, {
    update(cache, { data: { login } }) {
      cache.modify({
        fields: {
          login(existingLogin = []) {
            const loginRef = cache.writeFragment({
              data: login,
              fragment: gql`
                fragment newLogin on Login {
                  access_token
                  refresh_token
                }
              `,
            });
            return [...existingLogin, loginRef];
          },
        },
      });
    },
  });

  return login;
};
