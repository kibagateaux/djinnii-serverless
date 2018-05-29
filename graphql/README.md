#AUTOMATION PROTOCOLS
=====================
###GENERAL
1. All mutations and types must have their own individual files and use **export default**
2. File structures can be nested as deep as needed so long as rule #1 is followed
3. 

###TYPE DEFINITIONS
1. Type must be placed in schema found in type-definitions/[types/inputs/interfaces] as [type-name] and use **export default**
2. Any data that is connected to a Time node must also inclue `export const timeRelationName = "[relationship]";`. At this time all connections go into Time by default and this design pattern isnot expected to change.
3.


###QUERIES
1. Queries must be placed in type-definitions/Query as [query-name]

###MUTATIONS
1. Mutation must be placed in schema found in type-definitions/Mutation as [mutation-name]
2. Mutation Cypher code must be placed somewhere under mutations/.*/[mutation-name] and use **export default**
