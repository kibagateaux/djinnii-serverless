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


/* Query automation */
const queryNames = getResolverSchemaNames(querySchema);

// @desc takes list of query names and creates object of methods with Neo4j integration 
const Query = queryNames.reduce((qs, q) =>({
  ...qs,
  [q]: (obj, args, cts, resolveInfo) =>
    neo4jgraphql(obj, args, cts, resolveInfo)
}), {});



/* Mutation Automation */
const mutationNames = getResolverSchemaNames(mutationSchema);

// @desc takes list of mutation names, compares against available mutations, and creates [mutation]: (cypher params) with Cypher 
const Mutation = mutationNames.reduce((ms, m) => {
  if (m && mutationCyphers[m]) {
    return {
      ...ms, 
      [m]: (_, params) => {
        console.log('MUTATION', mutationCyphers[m], params );
        return withSession(createCypherMutation(mutationCyphers[m])(params))
      }
    }
  } else {
    console.log('mutation fail', m, mutationCyphers[m]);
    throw new Error("Mutations names must be consistent for schema and file where they are stored. Check for typos");
  }
}, {});

export default {
  Query,
  Mutation
};
