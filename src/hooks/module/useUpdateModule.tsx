import { gql, useMutation } from "@apollo/client";
import { Module } from "../../interfaces/module.interface";

interface UpdateModuleInput {
  variables: {
    moduleInput: Module;
  };
}

const UDATE_MODULE = gql`
  mutation updateModule($moduleInput: UpdateModuleInput!) {
    updateModule(moduleInput: $moduleInput) {
      name
      description
    }
  }
`;

export const useUpdateModule = () => {
  const [updateModule, error] = useMutation(UDATE_MODULE, {
    update(cache, { data: { updateModule } }) {
      cache.modify({
        fields: {
          updateModule(existingModules = []) {
            const newModulesRef = cache.writeFragment({
              data: updateModule,
              fragment: gql`
                fragment NewModule on Module {
                  id
                  name
                  description
                }
              `,
            });
            return [...existingModules, newModulesRef];
          },
        },
      });
    },
  });
  console.log(error);
  return { updateModule };
};
