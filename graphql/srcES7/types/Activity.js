import Time from '@types/Time';

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


const ActivityInput = `
  input ActivityInput {
    type: String
    startTime: Int
    endTime: Int
    duration: Int
    calories: Int
    distance: Int
  }
`;

export default () => [Activity, ActivityInput, Time];