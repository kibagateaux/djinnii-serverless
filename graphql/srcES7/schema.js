import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';
import types from './type-definitions';
// import typeDefs from './types'; // this works

export default makeExecutableSchema({
  typeDefs: types,
  resolvers
});