import { gql, useMutation } from "@apollo/client";
import { Menu } from "../../interfaces/menu.interface";

interface UpdateMenuInput {
  variables: {
    menuInput: Menu;
  };
}

const UDATE_MENU = gql`
  mutation updateMenu($menuInput: UpdateMenuInput!) {
    updateMenu(menuInput: $menuInput) {
      id
      name
    }
  }
`;

export const useUpdateMenu = () => {
  const [updateMenu, error] = useMutation(UDATE_MENU, {
    update(cache, { data: { updateMenu } }) {
      cache.modify({
        fields: {
          updateMenu(existingMenus = []) {
            const newMenusRef = cache.writeFragment({
              data: updateMenu,
              fragment: gql`
                fragment NewMenu on Menu {
                  id
                  name
                }
              `,
            });
            return [...existingMenus, newMenusRef];
          },
        },
      });
    },
  });
  return { updateMenu };
};
