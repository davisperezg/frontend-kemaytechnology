import { gql, useLazyQuery } from "@apollo/client";

const ME = gql`
  query me {
    me {
      id
      name
      lastName
      email
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
  const [me, { data, loading }] = useLazyQuery(ME, {
    pollInterval: 500,
  });

  return { me, data, loading };
};
