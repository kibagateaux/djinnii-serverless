import {v1 as neo4j} from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    process.env.NEO4J_USER || "neo4j",
    process.env.NEO4J_PASSWORD || "kiba"
  )
);

export default driver;

export const withSession = (fn) => fn(driver.session());

export const createCypherMutation = (query) => (args) => (session) => 
  session.run(query, args)
    .then((result) => {
      session.close();
      console.log("cypher mutation successful", result);
      return result;
    })
    .catch((error) => {
      console.log("error in cypher mutation", error);
      return error;
    })


// Should this just take a Cypher Query
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
