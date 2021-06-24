import { gql, useMutation } from "@apollo/client";

const UPDATE_ACTIVATE_USER = gql`
  mutation activateUser($id: String!) {
    activateUser(id: $id) {
      id
      status
    }
  }
`;

const UPDATE_DESACTIVATE_USER = gql`
  mutation desactivateUser($id: String!) {
    desactivateUser(id: $id) {
      id
      status
    }
  }
`;

export const useActivateUser = () => {
  const [activateUser, { error, loading }] = useMutation(UPDATE_ACTIVATE_USER);

  return { activateUser, error, loading };
};

export const useDesactivateUser = () => {
  const [desactivateUser, { error, loading }] = useMutation(
    UPDATE_DESACTIVATE_USER
  );

  return { desactivateUser, error, loading };
};
