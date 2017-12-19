import Time from './Time';

const Stat = `
  type Stat {
    _id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")    
    attribute: String!
    value: Float!
    time: Time! @relation(name: "UPGRADED_AT", direction: "OUT")
  }

`;


export default Stat;