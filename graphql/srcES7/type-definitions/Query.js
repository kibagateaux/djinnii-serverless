export default `
  type Query {
    AllUsers: [User]!
    User(id: ID): User
    UserActivities(id: ID, type: String, startTime: Int): [Activity]
  }
`;
