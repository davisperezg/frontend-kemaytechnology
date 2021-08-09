import { gql, useMutation } from "@apollo/client";
import { Menu } from "../../interfaces/menu.interface";
import { GET_MENUS } from "./useGetMenus";

interface CreateMenuInput {
  variables: {
    menuInput: Menu;
  };
}

const CREATE_MENU = gql`
  mutation registerMenu($menuInput: CreateMenuInput!) {
    registerMenu(menuInput: $menuInput) {
      id
      name
      link
    }
  }
`;

export const useCreateMenu = () => {
  const [registerMenu, { error, loading }] = useMutation(CREATE_MENU, {
    refetchQueries: () => [
      {
        query: GET_MENUS,
      },
    ],
  });
  return { registerMenu, error, loading };
};
