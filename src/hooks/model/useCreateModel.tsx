import { gql, useMutation } from "@apollo/client";
import { Model } from "../../interfaces/model.interface";
import { GET_MODELS } from "./useGetModels";

interface CreateModelInput {
  variables: {
    modelInput: Model;
  };
}

const CREATE_MODEL = gql`
  mutation registerModel($modelInput: CreateModelInput!) {
    registerModel(modelInput: $modelInput) {
      id
      name
      brand {
        id
        name
      }
    }
  }
`;

//https://stackoverflow.com/questions/58431224/how-does-apollo-client-graphql-refetchqueries-works
export const useCreateModel = () => {
  const [registerModel, { error, loading }] = useMutation(CREATE_MODEL, {
    refetchQueries: () => [
      {
        query: GET_MODELS,
      },
    ],
  });

  return { registerModel, error, loading };
};
