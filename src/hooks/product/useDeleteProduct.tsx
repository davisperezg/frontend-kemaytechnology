import { gql, useMutation } from "@apollo/client";
import { GET_PRODUCTS } from "./useGetProducts";

const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const useDeleteProduct = () => {
  const [deleteProduct, { error, loading }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: () => [
      {
        query: GET_PRODUCTS,
      },
    ],
  });

  return { deleteProduct, error, loading };
};
