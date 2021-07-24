import { gql, useMutation } from "@apollo/client";
import { Category } from "../../interfaces/category.interface";
import { GET_INGRESS } from "./useGetIngress";

interface UpdateIngressInput {
  variables: {
    ingressInput: Category;
  };
}

const UPDATE_INGRESS = gql`
  mutation updateIngress($ingressInput: UpdateIngressInput!) {
    updateIngress(ingressInput: $ingressInput) {
      id
      category {
        id
        name
      }
      detail
      observation
      units
      amount
    }
  }
`;

//https://stackoverflow.com/questions/58431224/how-does-apollo-client-graphql-refetchqueries-works
export const useUpdateIngress = () => {
  const [updateIngress, { error, loading }] = useMutation(UPDATE_INGRESS, {
    refetchQueries: () => [
      {
        query: GET_INGRESS,
      },
    ],
  });

  return { updateIngress, error, loading };
};
