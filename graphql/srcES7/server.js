import express from 'express';
import awsServerlessExpress from 'aws-serverless-express';
import awsExpressMiddleware from 'aws-serverless-express/middleware';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import {v1 as neo4j} from 'neo4j-driver';
import bodyParser from 'body-parser';
import schema from './schema';



function context(headers, secrets, event) {
  const driver = neo4j.driver(
    secrets.NEO4J_URI || "bolt://localhost:7687",
    neo4j.auth.basic(secrets.NEO4J_USER || "neo4j",
    secrets.NEO4J_PASSWORD || "kiba")
  );
  return {driver, headers, event};
};


const app = express();

app.use(awsExpressMiddleware.eventContext());

app.use('/', bodyParser.json(), graphqlExpress(request => ({
  schema,
  rootValue: {},
  context: context(request.headers, process.env, request.apiGateway.event),
  graphiql: true
})));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/'
}));



export default awsServerlessExpress.createServer(app);
