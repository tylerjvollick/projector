import React from "react";

import { ApolloProvider as Provider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";

import gql from "graphql-tag";

// import Client from "aws-appsync";
import appsyncConfig from "./config/awsappsync";
// import { Rehydrated } from "aws-appsync-react";

import App from "./AppWithoutProvider";

console.log({ appsyncConfig });

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      console.log("onError! ");
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri: appsyncConfig.aws_appsync_graphqlEndpoint,

      headers: {
        "x-api-key": appsyncConfig.aws_appsync_apiKey
      }
    })
  ]),
  cache: new InMemoryCache()
});

// const query = gql`
//   query listProjectorWorkoutsTables {
//     items {
//       movements {
//         successful
//         movementType {
//           label
//         }
//       }
//     }
//   }
// `;

const query = gql`
  query listProjectorWorkoutsTables {
    listProjectorWorkoutsTables {
      items {
        movements {
          successful
          movementType {
            label
          }
        }
      }
    }
  }
`;

client
  .query({
    query
  })
  .then(response => {
    console.log(" here");
    console.log({ response });
  });
// const client = new Client({
//   url: appsyncConfig.aws_appsync_graphqlEndpoint,
//   region: appsyncConfig.aws_appsync_region,
//   auth: {
//     type: appsyncConfig.aws_appsync_authenticationType,
//     apiKey: appsyncConfig.apiKey
//   }
// });

const WithProvider = () => (
  <Provider client={client}>
    <App />
  </Provider>
);

export default WithProvider;
