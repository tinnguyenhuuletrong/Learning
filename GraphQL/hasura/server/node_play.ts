import { Gql, Zeus, Chain } from '../codeGen/zeus'
import { execute } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws'
import gql from 'graphql-tag'

async function main() {
  await doQuery();
  await doSub();
}

//https://github.com/graphql-editor/graphql-zeus
async function doQuery() {
  // Chain('URL')
  const res = await Gql.query({
    users: [{}, { id: true, first_name: true, email: true }]
  })
  const gqlString = Zeus.query({ users: [{}, { id: true, first_name: true, email: true }] })
  console.log(gqlString, '->', res)
}

// Do Sub with apollo client ws
async function doSub() {
  const GRAPHQL_ENDPOINT = 'http://graphql-engine:8080/v1/graphql';

  const getWsClient = function (wsurl: string) {
    const client = new SubscriptionClient(
      wsurl, { reconnect: true }, ws
    );
    return client;
  };
  const createSubscriptionObservable = (wsurl: string, query: any, variables: any) => {
    const link = new WebSocketLink(getWsClient(wsurl));
    return execute(link, { query: query, variables: variables });
  };

  const SUBSCRIBE_QUERY = gql`
  subscription MySubscription {
    posts {
      id
      content
    }
  }`;

  const subscriptionClient = createSubscriptionObservable(
    GRAPHQL_ENDPOINT,                                      // GraphQL endpoint
    SUBSCRIBE_QUERY,                                       // Subscription query
    {}                                                     // Query variables
  );
  var consumer = subscriptionClient.subscribe(eventData => {
    // Do something on receipt of the event
    console.log("Received event: ");
    console.log(JSON.stringify(eventData, null, 2));
  }, (err) => {
    console.log('Err');
    console.log(err);
  });
}

main()