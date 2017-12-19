// Should I "assure" user first and then merge?
const assureUser = `MATCH (u:User {uid: {data}.uid}) 
                    MERGE (u)-[:EVENTS]->(e:Events)`;
// It appears creating a new node uses MERGE by convention to prevent errors or something

`MERGE (need:Need {title:{title}} )
WITH (need)
SET need.nodeId = ID(need)
RETURN need`;

export default `CREATE (u:User $user)-[:CREATED_AT]->(ts:Time $time) RETURN u`;