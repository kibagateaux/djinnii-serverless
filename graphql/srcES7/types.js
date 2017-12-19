import createNewUser from './mutations/user/createNewUser';

export default `
  type User {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")
    avatarName: String
    age: Int
    userName: String
    firstName: String
    lastName: String
    email: String
    purpose: [String]
    avatar: Avatar
    time: Time! @relation(name: "CREATED_AT", direction: "OUT")
  }

  input UserInput {
    firstName: String
  }


  type Activity {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")    
    type: String
    startTime: Int
    endTime: Int
    duration: Int
    distance: Int
    calories: Int
    time: Time! @relation(name: "ACTED_AT", direction: "IN")
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
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")    
    time: Int!
    activity: [Activity!] @relation(name: "ACTED_AT", direction: "OUT")
    stat: [Stat!] @relation(name: "UPGRADED_AT", direction: "IN")
  }
  input TimeInput {
    time: Int!
  }

  type Avatar {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")    
    name: String!
    stats: [Stat]
    partners: [Avatar]
  }

  type Stat {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")    
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
    CreateNewActivity(activity: ActivityInput, time: TimeInput, userId: ID) : Activity
  }

  ${/*
    Sample Mutation from neo4j's graphql post
    https://neo4j.com/developer/graphql/
  type Mutations {
    directed(movie:ID! director:ID!) : String
      @cypher(statement:"MATCH (m:Movie {title: $movie}), (d:Person {name: $director})
                         MERGE (d)-[:DIRECTED]->(m)")
  }
  */""}

  schema {
    query: Query
    mutation: Mutation
  }
`;