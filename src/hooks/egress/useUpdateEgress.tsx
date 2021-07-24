import { gql, useMutation } from "@apollo/client";
import { Category } from "../../interfaces/category.interface";
import { GET_EGRESS } from "./useGetEgress";

interface UpdateEgressInput {
  variables: {
    egressInput: Category;
  };
}

const UPDATE_EGRESS = gql`
  mutation updateEgress($egressInput: UpdateEgressInput!) {
    updateEgress(egressInput: $egressInput) {
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
export const useUpdateEgress = () => {
  const [updateEgress, { error, loading }] = useMutation(UPDATE_EGRESS, {
    refetchQueries: () => [
      {
        query: GET_EGRESS,
      },
    ],
  });

  return { updateEgress, error, loading };
};
