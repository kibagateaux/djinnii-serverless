export default `
  type User {
    uid: ID!
    avatarName: String
    age: Int
    userName: String
    firstName: String
    lastName: String
    email: String
    purpose: [String]
    overallRating: Float
    avatar: Avatar
  }
  type Activity {
    type: String
    startTime: Int
    endTime: Int
    duration: Int
    distance: Int
    calories: Int
  }

  type Avatar {
    name: String!
    stats: [Stat]
    partners: [Avatar]
  }
  type Stat {
    attribute: String!
    value: Float!
  }


  type Query {
    User(uid: ID): User
    AllUsers: [User]!
    Avatar(name: String, partner: ID): Avatar
    UserActivities(id: ID, type: String, startTime: Int): [Activity]
  }

  schema {
    query: Query
  }
`;