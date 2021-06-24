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
                  menus {
                    id
                    name
                  }
                  access {
                    id
                    name
                  }
                }
              `,
            });
            return [...existingModules, newModulesRef];
          },
        },
      });
    },
  });

  return { updateModule, error, loading };
};
