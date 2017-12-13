import {neo4jgraphql} from 'neo4j-graphql-js';

export default {
  Query: {
    User(object, args, ctx, resolveInfo) {
      return neo4jgraphql(object, args, ctx, resolveInfo);
    },
    Avatar(object, args, ctx, resolveInfo) {
      return neo4jgraphql(object, args, ctx, resolveInfo);
    },
    UserActivities(object, args, ctx, resolveInfo) {
      return neo4jgraphql(object, args, ctx, resolveInfo);
    }
  }
};
