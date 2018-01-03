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
  // add Cognito to context for authorization. Already exists in event/context but idk how specific
  // Authorization should be able to distinguish between different app clients
  // should look into tags or something for Cognito users so can differentiate paying customers without making API call to metadata table
});

export const GraphQLServerHandler = graphqlLambda((event, ctx) => ({ 
  schema,
  rootValue: {},
  context: graphContext(driver, event, ctx)
}));

export const GraphQLInspectorHandler = graphiqlLambda({
  endpointURL: '/'
});
