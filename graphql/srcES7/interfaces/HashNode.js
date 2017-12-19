const HashNode = `
  interface HashNode {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)") 
    time: Time!
  }
`;

export default HashNode;