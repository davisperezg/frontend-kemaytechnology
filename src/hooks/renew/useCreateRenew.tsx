import { Renew } from "../../interfaces/renewinterface";
import { gql, useMutation } from "@apollo/client";
import { GET_RENEWS } from "./useGetRenew";
import { GET_VEHICLES } from "../vehicle/useGetVehicle";

interface CreateRenewInput {
  variables: {
    renewInput: Renew;
  };
}

const CREATE_RENEW = gql`
  mutation registerRenew($renewInput: CreateRenewInput!) {
    registerRenew(renewInput: $renewInput) {
      id
      registeredBy {
        id
        name
        lastName
      }
      updatedBy {
        id
        name
        lastName
      }
      vehicle {
        id
        plate
      }
      billing {
        id
        name
      }
      expirationDate
      renovationStart
      renovationEnd
      createdAt
      updatedAt
    }
  }
`;

export const useCreateRenew = () => {
  const [registerRenew, { error, loading }] = useMutation(CREATE_RENEW, {
    refetchQueries: () => [
      {
        query: GET_VEHICLES,
      },
    ],
  });

  return { registerRenew, error, loading };
};
