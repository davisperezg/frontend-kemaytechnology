import { gql } from "@apollo/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphQLClient } from "../../config/config";

interface ToCheck {
  id: string;
}

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParams {
  variables: { renewInput: ToCheck };
}

const TO_CHECK = gql`
  mutation toCheck($renewInput: UpdateRenewInput!) {
    toCheck(renewInput: $renewInput) {
      id
      status
    }
  }
`;

export const useToCheck = () => {
  const queryClient = useQueryClient();

  return useMutation<ToCheck, IError, ICreateParams>(["renews"], {
    mutationFn: async ({ variables }) =>
      await graphQLClient.request(TO_CHECK, variables),
    onSuccess(data: any) {
      queryClient.invalidateQueries(["vehicles"]);
    },
  });
};
