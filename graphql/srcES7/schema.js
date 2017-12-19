import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './typeDefinitions';
import resolvers from './resolvers';

console.log('schema', typeof typeDefs);
export default makeExecutableSchema({
  typeDefs,
  resolvers
});