import createNewUser from './mutations/user/createNewUser';

export default `
  type User {
    id: ID! @cypher(statement: "WITH {this} AS this RETURN ID(this)")
    avatarName: String
    age: Int
    userName: String
    firstName: String
    lastName: String
    email: String
    purpose: [String]
    avatar: Avatar
    time: Time
    ${""/*
      Fix cypher query here to match on time relation 
      then related Activity nodes 
      ORDER BY timestamp 
      LIMIT latest
    activities(latest:Int = 100): [Activity!] @cypher(name:"ACTED_IN", direction:IN)
    */}
  }

  input UserInput {
    firstName: String
  }


  type Activity {
    type: String
    startTime: Int
    endTime: Int
    duration: Int
    distance: Int
    calories: Int
    time: Time!
  }
  
  input ActivityInput {
    type: String
    startTime: Int
    endTime: Int
    duration: Int
    calories: Int
    distance: Int
    time: TimeInput!
  }

  type Time {
    time: Int!
  }
  input TimeInput {
    time: Int!
  }

  type Avatar {
    name: String!
    stats: [Stat]
    partners: [Avatar]
  }

  type Stat {
    attribute: String!
    value: Float!
    time: Time
  }

  type Query {
    User(uid: ID): User
    AllUsers: [User!]
    Avatar(name: String, partner: ID): Avatar
    UserActivities(uid: ID, type: String, startTime: Int): [Activity]
  }

  type Mutation {
    CreateNewUser(user: UserInput, time: TimeInput) : User
    CreateNewActivity(activity: ActivityInput) : Activity
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;