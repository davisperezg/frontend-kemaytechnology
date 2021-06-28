import { gql, useMutation } from "@apollo/client";
import { AuthUser } from "../../interfaces/auth.interface";

interface AuthChangePasswordInputToAdmin {
  variables: {
    authInput: AuthUser;
  };
}

interface AuthChangePasswordInputToUser {
  variables: {
    authInput: AuthUser;
  };
}
const UPDATE_PASSWORD_TO_ADMIN = gql`
  mutation changePasswordToAdmin($authInput: AuthChangePasswordInputToAdmin!) {
    changePasswordToAdmin(authInput: $authInput)
  }
`;

const UPDATE_PASSWORD_TO_USER = gql`
  mutation changePasswordToUser($authInput: AuthChangePasswordInputToUser!) {
    changePasswordToUser(authInput: $authInput)
  }
`;

//TO ADMIN
export const useChangePasswordToAdmin = () => {
  const [changePasswordToAdmin, { error, loading }] = useMutation(
    UPDATE_PASSWORD_TO_ADMIN
  );

  return { changePasswordToAdmin, error, loading };
};

//TO USER
export const useChangePasswordToUser = () => {
  const [changePasswordToUser, { error, loading }] = useMutation(
    UPDATE_PASSWORD_TO_USER
  );

  return { changePasswordToUser, error, loading };
};
