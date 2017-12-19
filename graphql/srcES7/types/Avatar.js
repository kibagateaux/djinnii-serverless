import Stat from '@types/Stat';
import User from '@types/User';
import Time from '@types/Time';

const Avatar = `
  type Avatar {
    name: String
    stats: [Stat!]
    partners: [Avatar!, User!]
    time: Time! @relation(name: "EXISTED_AT", direction: "OUT")
  }
`;

const AvatarInput = `
  input AvatarInput {
    name: String
  }
`;

export default () => [Avatar, AvatarInput, Stat, User, Time];