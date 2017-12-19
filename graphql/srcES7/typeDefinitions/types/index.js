import Time from './Time';
import TimeInput from './TimeInput';
import User from './User';
import UserInput from './UserInput';

import Stat from './Stat';
import StatInput from './StatInput';
import Avatar from './Avatar';
import Activity from './Activity';
import ActivityInput from './ActivityInput';
import Query from './Query';
import Mutation from './Mutation';
import interfaces from '../interfaces';

const EntryPoints = `
  schema {
    query: Query
    mutation: Mutation
  }
`
const types = [
  Time, User, Stat, Avatar, Activity, Query, Mutation, interfaces
];

const reduceTypes = (typeList, type) => {
  console.log('red type', typeList, type);
  switch(typeof type) {
    case "function": return [...typeList, reduceTypes(type())];
    case "object": return type.reduce(reduceTypes, []);
    case "string": return [...typeList, type];
    default: return typeList;
  }
}

// console.log('types', types);
// const reducedTypes = types.reduce(reduceTypes, []);
// console.log('red types', reducedTypes);

export default [
  ...interfaces,
  Time,
  TimeInput,
  User,
  UserInput,
  Stat,
  StatInput,
  Activity,
  ActivityInput,
  Avatar,
  Query,
  Mutation,
  EntryPoints
].reduce((schema, type) => schema + type);