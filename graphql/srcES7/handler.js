import awsServerlessExpress from 'aws-serverless-express';
import server from './server';
 
export const GraphQLServer = (event, context) => 
  awsServerlessExpress.proxy(server, event, context);
