export default `
  type User {
    id: ID!
    avatarName: String
    age: Int
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
    User(id: ID): User
    Avatar(name: String, partner: ID): Avatar
    UserActivities(id: ID, type: String, startTime: Int): [Activity]
  }

  schema {
    query: Query
  }
`;