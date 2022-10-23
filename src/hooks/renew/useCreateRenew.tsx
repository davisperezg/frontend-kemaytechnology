import { Renew } from "../../interfaces/renewinterface";
import { gql } from "@apollo/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParams {
  variables: { renewInput: Renew };
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
  const queryClient = useQueryClient();

  return useMutation<Renew, IError, ICreateParams>(["renews"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(CREATE_RENEW, variables),
    onSuccess(data: any) {
      queryClient.invalidateQueries(["vehicles"]);
    },
  });
};
