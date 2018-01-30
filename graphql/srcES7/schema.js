import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';
import types from './type-definitions';
// import typeDefs from './types'; // this works

console.log('schema', typeof typeDefs);
export default makeExecutableSchema({
  typeDefs: types,
  resolvers
});