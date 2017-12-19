import Avatar from './Avatar';
import User from './User';
import Activity from './Activity';

const Query = `
  type Query {
    User(uid: ID): User
    AllUsers: [User!]
    Avatar(name: String, partner: ID): Avatar
    UserActivities(uid: ID, type: String, startTime: Int): [Activity]
  }
`;

export default Query;