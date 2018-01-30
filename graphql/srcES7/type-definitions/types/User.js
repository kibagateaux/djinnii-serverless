export default `
  type User {
    firstName: String
    id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")
    avatarName: String
    age: Int
    purpose: [String]
    overallRating: Float
    activities: [Activity] @relation(name: "ACTED", direction:"OUT")
    times: [Time!] @relation(name: "CREATED_AT", direction:"OUT")
  }
`;

export const timeRelationName = "EXISTED_AT"