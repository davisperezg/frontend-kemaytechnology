import { gql, useMutation } from "@apollo/client";
import { Category } from "../../interfaces/category.interface";
import { GET_INGRESS } from "./useGetIngress";

interface CreateIngressInput {
  variables: {
    ingressInput: Category;
  };
}

const CREATE_INGRESS = gql`
  mutation registerIngress($ingressInput: CreateIngressInput!) {
    registerIngress(ingressInput: $ingressInput) {
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
export const useCreateIngress = () => {
  const [registerIngress, { error, loading }] = useMutation(CREATE_INGRESS, {
    refetchQueries: () => [
      {
        query: GET_INGRESS,
      },
    ],
  });

  return { registerIngress, error, loading };
};
