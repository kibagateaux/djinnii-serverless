import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './types';
import resolvers from './resolvers.js';

console.log('schema', typeof typeDefs);
export default makeExecutableSchema({
  typeDefs,
  resolvers
});