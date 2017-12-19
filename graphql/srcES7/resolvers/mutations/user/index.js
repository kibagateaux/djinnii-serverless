import {createCypherMutation, withSession} from '../../../neo4j';
import CreateNewUser from './CreateNewUser';

export default {
  CreateNewUser(_, params) { 
    console.log('create user params', params, params.user);
    return withSession(createCypherMutation(CreateNewUser)(params));
  }
}