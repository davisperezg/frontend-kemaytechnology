import { gql, useMutation } from "@apollo/client";
import { Brand } from "../../interfaces/brand.interface";
import { GET_BRANDS } from "./useGetBrands";

interface UpdateBrandInput {
  variables: {
    brandInput: Brand;
  };
}

const UPDATE_BRAND = gql`
  mutation updateBrand($brandInput: UpdateBrandInput!) {
    updateBrand(brandInput: $brandInput) {
      id
      name
    }
  }
`;

export const useUpdateBrand = () => {
  const [updateBrand, { error, loading }] = useMutation(UPDATE_BRAND, {
    refetchQueries: () => [
      {
        query: GET_BRANDS,
      },
    ],
  });

  return { updateBrand, error, loading };
};
