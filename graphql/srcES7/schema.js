import {makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';
import typesDefs from './type-definitions';

export default makeExecutableSchema({
  typeDefs,
  resolvers
});