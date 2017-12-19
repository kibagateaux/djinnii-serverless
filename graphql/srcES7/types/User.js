import Avatar from '@types/Avatar';
const User = `
  type User {
    userId: ID!
    avatarName: String
    age: Int
    userName: String
    firstName: String
    lastName: String
    email: String
    purpose: [String]
    overallRating: Float
    avatar: Avatar
    time: Time
  }
`;

const UserInput = `
  input UserInput {
    userId
  }
`
/*
  If you’re exporting array of schema strings and there are circular dependencies, the array can be wrapped in a function
  https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
*/
export default () => [User, Avatar];