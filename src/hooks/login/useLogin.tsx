import { gql, useMutation } from "@apollo/client";

interface AuthInput {
  variables: {
    authInput: {
      email: string;
      password: string;
    };
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
  const [login, { error }] = useMutation(POST_LOGIN, {
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
