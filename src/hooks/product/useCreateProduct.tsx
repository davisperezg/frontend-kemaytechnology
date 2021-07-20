import { gql, useMutation } from "@apollo/client";
import { Product } from "../../interfaces/product.interface";
import { GET_PRODUCTS } from "./useGetProducts";

interface CreateProductInput {
  variables: {
    productInput: Product;
  };
}

const CREATE_PRODUCT = gql`
  mutation registerProduct($productInput: CreateProductInput!) {
    registerProduct(productInput: $productInput) {
      id
      name
      description
      price
      category {
        id
        name
      }
      brand {
        id
        name
      }
      model {
        id
        name
      }
    }
  }
`;

export const useCreateProduct = () => {
  const [registerProduct, { error, loading }] = useMutation(CREATE_PRODUCT, {
    refetchQueries: () => [
      {
        query: GET_PRODUCTS,
      },
    ],
  });

  return { registerProduct, error, loading };
};
