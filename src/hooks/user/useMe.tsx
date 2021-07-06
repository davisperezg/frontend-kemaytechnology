import { gql, useLazyQuery } from "@apollo/client";
import { logout } from "../../store/auth/action";
import { useDispatch } from "react-redux";

const ME = gql`
  query me {
    me {
      id
      name
      lastName
      email
      status
      role {
        name
        modules {
          id
          name
          access {
            name
          }
          menus {
            id
            name
            link
          }
        }
      }
    }
  }
`;

export const useMe = () => {
  const [me, { data, loading, error }] = useLazyQuery(ME, {
    pollInterval: 500,
  });

  const dispatch = useDispatch();

  if (error && error?.graphQLErrors[0].extensions?.exception.status === 401) {
    alert(error.graphQLErrors[0].extensions.exception.response.message);
    dispatch(logout());
  }

  return { me, data, loading };
};
