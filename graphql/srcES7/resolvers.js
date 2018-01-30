import {neo4jgraphql} from 'neo4j-graphql-js';

// How to automate this?
// for Queries
// import Query from './type-definitions/Query'
// queryName = /^(\s*):.*/.exec(Query)
// factoryfunc(queryName)
// Query {...factoriedFunctions}

// for Mutations
// import Mutations from ./mutations
// import helpers from ./neo4j
// requireAll(Mutations)
// MutationName = fileName
// factorFun(MutationName)
// Mutation {...factoriedFuncs}

export default {
  Query: {
    User(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    AllUsers(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    UserActivities(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    }
  }
};
