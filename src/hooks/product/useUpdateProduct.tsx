import { gql, useMutation } from "@apollo/client";
import { Product } from "../../interfaces/product.interface";
import { GET_PRODUCTS } from "./useGetProducts";

interface UpdateProductInput {
  variables: {
    productInput: Product;
  };
}

const UPDATE_PRODUCT = gql`
  mutation updateService($productInput: UpdateProductInput!) {
    updateProduct(productInput: $productInput) {
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

export const useUpdateProduct = () => {
  const [updateProduct, { error, loading }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: () => [
      {
        query: GET_PRODUCTS,
      },
    ],
  });

  return { updateProduct, error, loading };
};
