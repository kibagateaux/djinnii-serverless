export default `
  interface Node {
    time: Time!
    id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")
  }
`;