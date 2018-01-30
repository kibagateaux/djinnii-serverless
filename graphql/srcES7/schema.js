import {makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';
import typeDefs from './type-definitions';

export default makeExecutableSchema({
  typeDefs,
  resolvers
});