// User's are avatars because then Avatar's have Avatars
// this makes it easier to reason about relation between them
export default `
  type Avatar {
    firstName: String
    id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")
    age: Int
    purpose: [String]
    overallRating: Float
    activities: [Activity] @relation(name: "ACTED", direction:"OUT")
    times: [Time!] @relation(name: "CREATED_AT", direction:"OUT")
  }
`;

export const timeRelationName = "EXISTED_AT"