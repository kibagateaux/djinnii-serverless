import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './types';
import resolvers from './resolvers.js';

export default makeExecutableSchema({
  typeDefs,
  resolvers
});