import Activity from '@types/Actvivity';
import Stat from '/types/Stat';

const Time = `
  type Time {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")    
    time: Int!
    activity: [Activity!] @relation(name: "ACTED_AT", direction: "IN")
    stat: [Stat!] @relation(name: "UPGRADED_AT", direction: "IN")
  }

`;

const TimeInput = `
  input TimeInput {
    time: Int!
  }
`
/*
If you’re exporting array of schema strings and there are circular dependencies, the array can be wrapped in a function
https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
*/

export default () => [Time, TimeInput, Activity, Stat];