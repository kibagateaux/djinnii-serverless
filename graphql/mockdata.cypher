// Create fake users
WITH ["Alex","Tomi","CJ"] AS names FOREACH (r IN range(0, 2) | CREATE (u:User {firstName: names[r % size(names)]})-[:CREATED_AT]->(ts:Time {time: r})-[:ACTED]->(a:Activity {type: "walking"}))
