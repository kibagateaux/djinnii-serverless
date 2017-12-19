import Stat from './Stat';
import User from './User';
import Time from './Time';

const Avatar = `
  type Avatar {
    name: String
    stats: [Stat!]
    partners: [Avatar!]
    time: Time! @relation(name: "EXISTED_AT", direction: "OUT")
  }
`;

const AvatarInput = `
  input AvatarInput {
    name: String
  }
`;

export default Avatar;