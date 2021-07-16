import { gql, useMutation } from "@apollo/client";
import { Category } from "../../interfaces/category.interface";
import { GET_CATEGORYS } from "./useGetCategorys";

interface UpdateCategoryInput {
  variables: {
    categoryInput: Category;
  };
}

const UPDATE_CATEGORY = gql`
  mutation updateCategory($categoryInput: UpdateCategoryInput!) {
    updateCategory(categoryInput: $categoryInput) {
      id
      name
    }
  }
`;

export const useUpdateCategory = () => {
  const [updateCategory, { error, loading }] = useMutation(
    UPDATE_CATEGORY
    //   , {
    //   refetchQueries: () => [
    //     {
    //       query: GET_CATEGORYS,
    //     },
    //   ],
    // }
  );

  return { updateCategory, error, loading };
};
