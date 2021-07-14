import { gql, useMutation } from "@apollo/client";
import { Category } from "../../interfaces/category.interface";
import { GET_CATEGORYS } from "./useGetCategorys";

interface CreateCategoryInput {
  variables: {
    categoryInput: Category;
  };
}

const CREATE_CATEGORY = gql`
  mutation registerCategory($categoryInput: CreateCategoryInput!) {
    registerCategory(categoryInput: $categoryInput) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

//https://stackoverflow.com/questions/58431224/how-does-apollo-client-graphql-refetchqueries-works
export const useCreateCategory = () => {
  const [registerCategory, { error, loading }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: () => [
      {
        query: GET_CATEGORYS,
      },
    ],
  });

  return { registerCategory, error, loading };
};
