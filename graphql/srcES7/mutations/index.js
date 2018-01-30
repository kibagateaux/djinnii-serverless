import {createCypherMutation, withSession} from '../neo4j';
import CreateNewUser from './CreateNewUser';
import CreateNewActivity from './CreateNewActivity';

export default {
  CreateNewUser(_, params) { 
    console.log('create user params', params, params.user);
    return withSession(createCypherMutation(CreateNewUser)(params));
  },
  CreateNewActivity(_, params) {
    console.log('create user params', params, params.user);
    return withSession(createCypherMutation(CreateNewActivity)(params));
  }
}