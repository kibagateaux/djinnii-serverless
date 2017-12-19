import {
  graphqlLambda,
  graphiqlLambda
} from 'apollo-server-lambda';
import {v1 as neo4j} from 'neo4j-driver';
import schema from './schema';
import driver from './neo4j';

const graphContext = (driver, event, ctx) => ({
  driver,
  headers: event.headers,
  lambdaEvent: event,
  lambdaContext: ctx
});

export const GraphQLServerHandler = graphqlLambda((event, ctx) => ({ 
  schema,
  rootValue: {},
  context: graphContext(driver, event, ctx)
}));

export const GraphQLInspectorHandler = graphiqlLambda({
  endpointURL: '/'
});
