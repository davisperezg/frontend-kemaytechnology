import { GraphQLClient } from "graphql-request";
import { getLocal } from "../lib/local-storage";

export const URL_GQL =
  process.env.REACT_APP_URL || "http://localhost:8080/graphql";

export const graphQLClient = new GraphQLClient(URL_GQL, {
  headers: {
    Authorization: `Bearer ${getLocal("accessToken")}`,
  },
});
