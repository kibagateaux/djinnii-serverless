import Time from './Time';
import HashNode from '../interfaces/HashNode';

const Activity = `
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
`;


export default Activity;