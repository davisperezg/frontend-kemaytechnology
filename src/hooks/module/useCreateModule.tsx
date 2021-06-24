import { gql, useMutation } from "@apollo/client";
import { Module } from "../../interfaces/module.interface";
import { GET_MODULES } from "./useGetModules";

interface CreateModuleInput {
  variables: {
    moduleInput: Module;
  };
}

const CREATE_MODULE = gql`
  mutation registerModule($moduleInput: CreateModuleInput!) {
    registerModule(moduleInput: $moduleInput) {
      id
      name
      description
      createdAt
      updatedAt
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

//https://stackoverflow.com/questions/58431224/how-does-apollo-client-graphql-refetchqueries-works
export const useCreateModule = () => {
  const [registerModule, { error, loading }] = useMutation(CREATE_MODULE, {
    refetchQueries: () => [
      {
        query: GET_MODULES,
      },
    ],
  });

  return { registerModule, error, loading };
};
