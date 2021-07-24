import { gql, useMutation } from "@apollo/client";
import { Category } from "../../interfaces/category.interface";
import { GET_EGRESS } from "./useGetEgress";

interface CreateEgressInput {
  variables: {
    egressInput: Category;
  };
}

const CREATE_EGRESS = gql`
  mutation registerEgress($egressInput: CreateEgressInput!) {
    registerEgress(egressInput: $egressInput) {
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
export const useCreateEgress = () => {
  const [registerEgress, { error, loading }] = useMutation(CREATE_EGRESS, {
    refetchQueries: () => [
      {
        query: GET_EGRESS,
      },
    ],
  });

  return { registerEgress, error, loading };
};
