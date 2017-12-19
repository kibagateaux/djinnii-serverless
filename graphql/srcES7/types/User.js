import Time from '@types/Time';

const User = `
  type User {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")
    avatarName: String
    age: Int
    firstName: String
    lastName: String
    email: String
    purpose: [String]
    time: Time! @relation(name: "EXISTED_AT", direction: "OUT")
  }
`;

const UserInput = `
  input UserInput {
    firstName: String
  }
`
/*
  If you’re exporting array of schema strings and there are circular dependencies, the array can be wrapped in a function
  https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
*/
export default () => [User, UserInput, Avatar];