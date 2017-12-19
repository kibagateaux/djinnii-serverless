import userMutations from './user';
import activityMutations from './activity';

export default {
  ...userMutations,
  ...activityMutations
}