import User from './User';
import Activity from './Activity';
import Time from './User';

const Mutation = `
  type Mutation {
    CreateNewUser(user: UserInput, time: TimeInput) : User
    CreateNewActivity(activity: ActivityInput, time: TimeInput, userId: ID) : Activity
  }
`;

export default Mutation;