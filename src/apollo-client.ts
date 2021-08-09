/* eslint-disable no-loop-func */
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
  fromPromise,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getLocal, setLocal } from "./lib/local-storage";
import { onError } from "@apollo/client/link/error";
import { POST_REFRESH } from "./hooks/login/useRefreshToken";
import { URLC } from "./config/config";

let isRefreshing = false;
let pendingRequests: any = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback: any) => callback());
  pendingRequests = [];
};

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions!.exception.status) {
          case 401:
            let forward$;
            if (!isRefreshing) {
              isRefreshing = true;
              forward$ = fromPromise(
                client
                  .mutate({
                    mutation: POST_REFRESH,
                    variables: {
                      authInput: {
                        email: getLocal("username"),
                        refresh_token: getLocal("refreshToken"),
                      },
                    },
                  })
                  .then(
                    ({
                      data: {
                        refreshToken: { access_token },
                      },
                    }) => {
                      setLocal("accessToken", access_token);
                      return true;
                    }
                  )
                  .then(() => {
                    resolvePendingRequests();
                    return true;
                  })
                  .catch(() => {
                    pendingRequests = [];
                    return false;
                  })
                  .finally(() => {
                    isRefreshing = false;
                  })
              );
            } else {
              forward$ = fromPromise(
                new Promise((resolve: any) => {
                  pendingRequests.push(() => resolve());
                })
              );
            }

            return forward$.flatMap(() => forward(operation));
          default:
            console.log(
              `[ERROR]: Message: ${err.message}, Location: ${err.locations}, Path: ${err.path}`
            );
        }
      }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);
//http://localhost:3000/graphql
const httpLink = createHttpLink({
  uri: URLC,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = getLocal("accessToken");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
