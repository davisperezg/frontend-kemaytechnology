import { gql, useMutation } from "@apollo/client";
import { Token } from "../../interfaces/auth.interface";

interface AuthRefreshTokenInput {
  variables: {
    authInput: Token;
  };
}

export const POST_REFRESH = gql`
  mutation refreshToken($authInput: AuthRefreshTokenInput!) {
    refreshToken(authInput: $authInput) {
      access_token
    }
  }
`;
