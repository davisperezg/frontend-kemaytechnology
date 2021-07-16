import { gql, useMutation } from "@apollo/client";
import { Brand } from "../../interfaces/brand.interface";
import { GET_BRANDS } from "./useGetBrands";

interface CreateBrandInput {
  variables: {
    brandInput: Brand;
  };
}

const CREATE_BRAND = gql`
  mutation registerBrand($brandInput: CreateBrandInput!) {
    registerBrand(brandInput: $brandInput) {
      id
      name
      category {
        id
        name
      }
    }
  }
`;

//https://stackoverflow.com/questions/58431224/how-does-apollo-client-graphql-refetchqueries-works
export const useCreateBrand = () => {
  const [registerBrand, { error, loading }] = useMutation(CREATE_BRAND, {
    refetchQueries: () => [
      {
        query: GET_BRANDS,
      },
    ],
  });

  return { registerBrand, error, loading };
};
