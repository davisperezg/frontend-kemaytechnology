import { gql, useQuery } from "@apollo/client";

const ME = gql`
  query me {
    me {
      id
      name
      lastName
      email
    }
  }
`;

export const useMe = () => {
  const { loading, error, data } = useQuery(ME, {
    pollInterval: 500,
  });
  console.log(data);
  return { loading, error, data };
};
