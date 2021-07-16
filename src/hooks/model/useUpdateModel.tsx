import { gql, useMutation } from "@apollo/client";
import { Model } from "../../interfaces/model.interface";
import { GET_MODELS } from "./useGetModels";

interface UpdateModelInput {
  variables: {
    modelInput: Model;
  };
}

const UPDATE_MODEL = gql`
  mutation updateModel($modelInput: UpdateModelInput!) {
    updateModel(modelInput: $modelInput) {
      id
      name
    }
  }
`;

export const useUpdateModel = () => {
  const [updateModel, { error, loading }] = useMutation(UPDATE_MODEL, {
    refetchQueries: () => [
      {
        query: GET_MODELS,
      },
    ],
  });

  return { updateModel, error, loading };
};
