import { gql, useMutation } from "@apollo/client";
import { Module } from "../../interfaces/module.interface";
import { GET_MODULES } from "./useGetModules";

interface UpdateModuleInput {
  variables: {
    moduleInput: Module;
  };
}

const UDATE_MODULE = gql`
  mutation updateModule($moduleInput: UpdateModuleInput!) {
    updateModule(moduleInput: $moduleInput) {
      id
      name
      description
      menus {
        id
        name
      }
      access {
        id
        name
      }
    }
  }
`;

export const useUpdateModule = () => {
  const [updateModule, { error, loading }] = useMutation(UDATE_MODULE, {
    refetchQueries: () => [
      {
        query: GET_MODULES,
      },
    ],
  });

  return { updateModule, error, loading };
};
