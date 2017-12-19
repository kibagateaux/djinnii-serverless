import {neo4jgraphql} from 'neo4j-graphql-js';
import Mutation from './mutations';
console.log('mutation', Mutation);

export default {
  Query: {
    User(object, args, ctx, resolveInfo) {
      return neo4jgraphql(object, args, ctx, resolveInfo);
    },
    AllUsers(object, args, ctx, resolveInfo) {
      return neo4jgraphql(object, args, ctx, resolveInfo);
    },
    Avatar(object, args, ctx, resolveInfo) {
      return neo4jgraphql(object, args, ctx, resolveInfo);
    },
    UserActivities(object, args, ctx, resolveInfo) {
      return neo4jgraphql(object, args, ctx, resolveInfo);
    }
  },
  Mutation
};


/* 

Sample Mutation from https://github.com/theborderland/realities/blob/master/api/src/index.js
Seems like a bad coder, dont trust but he knows more neo than you
Mutation {
  createNeed(_, params) {
    const session = driver.session();
    const query = `MERGE (need:Need {title:{title}} )
      WITH (need)
      SET need.nodeId = ID(need)
      RETURN need`;

    return session.run(query, params)
      .then((result) => {
        session.close();
        const singleRecord = result.records[0];
        const need = singleRecord.get(0);
        return need.properties;
      }).catch((error) => {
        console.log(error);
      });
    }
*/