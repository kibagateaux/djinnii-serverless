export default `
  type Query {
    User(id: ID): User
    UserActivities(id: ID, type: String, startTime: Int): [Activity]
  }
`;
