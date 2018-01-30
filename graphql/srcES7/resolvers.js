import {neo4jgraphql} from 'neo4j-graphql-js';
import querySchema from './type-definitions/Query';

const queries = querySchema.split('\n');
const queryNames = queries
  .map((q) => /([A-Za-z]+)(?=[:|(])[\s\S]*/mg.exec(q), []) // gets queryname from beginning of line
  .filter(is => is) // filters null matches
  .map((match) => match[1]); // parses oout just match string

/**
 * @desc takes list of query names and creates Query object with Neo4j integration 
 */
const Query = queryNames.reduce((qs, q) =>({
  ...qs,
  [q]: (obj, args, cts, resolveInfo) =>
    neo4jgraphql(obj, args, cts, resolveInfo)
}), {})


// for Mutations
// import MutationsCypher from ./mutations
// import helpers from ./neo4j
// imort mutationSchema from './type-definitions/Mutation
// requireAll(Mutations)
// compare mutation schema to mutation cypher and only take those where names for both
// MutationName = mutationSchema
// factorFun(MutationName)
// Mutation {...factoriedFuncs}

export default {
  Query
};
