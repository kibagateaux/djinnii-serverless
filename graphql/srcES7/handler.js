import {
  graphqlLambda,
  graphiqlLambda
} from 'apollo-server-lambda';
import {v1 as neo4j} from 'neo4j-driver';
import schema from './schema';

function graphContext(headers, secrets, event, ctx) {
  const driver = neo4j.driver(
    secrets.NEO4J_URI || "bolt://localhost:7687",
    neo4j.auth.basic(secrets.NEO4J_USER || "neo4j",
    secrets.NEO4J_PASSWORD || "kiba")
  );
  return {driver, headers, lambdaEvent: event, lambdaContext: ctx};
};

export const GraphQLServerHandler = graphqlLambda((event, ctx) => ({ 
  schema,
  context: graphContext(event.headers, process.env, event, ctx)
}));

export const GraphQLInspectorHandler = graphiqlLambda({
  endpointURL: '/'
});
