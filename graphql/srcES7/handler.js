import {
  graphqlLambda,
  graphiqlLambda
} from 'apollo-server-lambda';
import {v1 as neo4j} from 'neo4j-driver';
import schema from './schema';
import driver from './neo4j';

function graphContext(secrets, event, ctx) {

  return {
    driver,
    headers: event.headers,
    lambdaEvent: event,
    lambdaContext: ctx
  };
};

export const GraphQLServerHandler = graphqlLambda((event, ctx) => ({ 
  schema,
  rootValue: {},
  context: graphContext(process.env, event, ctx)
}));

export const GraphQLInspectorHandler = graphiqlLambda({
  endpointURL: '/'
});
