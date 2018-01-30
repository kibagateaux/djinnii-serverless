import {neo4jgraphql} from 'neo4j-graphql-js';
import requireAll from 'require-all';
import {
  isString
} from 'lodash';

import {createCypherMutation, withSession} from './neo4j';
import querySchema from './type-definitions/Query';
import mutationSchema from './type-definitions/Mutation';
import mutationCyphers from './mutations';

const getResolverSchemaNames = (schema) =>
  isString(schema) ? schema
    .split('\n')
    .map((q) => /([A-Za-z]+)(?=[:|(])[\s\S]*/mg.exec(q), []) // gets queryname from beginning of line
    .filter(is => is) // filters null matches
    .map((match) => match[1]) : [];


const queryNames = getResolverSchemaNames(querySchema);

// @desc takes list of query names and creates object of methods with Neo4j integration 
const Query = queryNames.reduce((qs, q) =>({
  ...qs,
  [q]: (obj, args, cts, resolveInfo) =>
    neo4jgraphql(obj, args, cts, resolveInfo)
}), {});

const mutationNames = getResolverSchemaNames(mutationSchema);

console.log('mut names', mutationNames);
const Mutation = mutationNames.reduce((ms, m) => {
  console.log('red mut', m, mutationCyphers[m]);
  if (m && mutationCyphers[m]) {
    return {
      ...ms, 
      [m]: (_, params) => {
        console.log('MUTATION', mutationCyphers[m], params );
        return withSession(createCypherMutation(mutationCyphers[m])(params))
      }
    }
  } else {
    throw new Error("Mutations names must be consistent for schema and file where they are stored. Check for typos");
  }
}, {});
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
  Query,
  Mutation
};
