import {
  graphqlLambda,
  graphiqlLambda
} from 'apollo-server-lambda';
import {v1 as neo4j} from 'neo4j-driver';
import driver from './neo4j';
import schema from './schema';

const createGraphContext = (headers, secrets, event, ctx) => ({
  driver,
  headers,
  lambdaEvent: event,
  lambdaContext: ctx
});

export const GraphQLServerHandler = graphqlLambda((event, ctx) => ({ 
  schema,
  context: createGraphContext(event.headers, process.env, event, ctx)
}));

export const GraphQLInspectorHandler = graphiqlLambda({
  endpointURL: '/'
});
