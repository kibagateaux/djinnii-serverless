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