import AWS from 'aws-sdk';
import {

} from 'lodash/fp';

AWS.config.update({
  region: "us-east-1"
});

export const DB = new AWS.DynamoDB.DocumentClient(); // FIXME: set standard version

export const batchPut = (table, items =[], userId) => {
  console.log('put', userId, items[0])
  const request = {
    RequestItems: {
      [table]: items.map((obj) => ({
        PutRequest: {
          Item: {...obj, userId}
          // default user id because what if we treat all anons as one instead of trying to make them something they are not i.e. identifiable Just a theory
        }
      }))
    }
  };
  return new Promise((resolve, reject) =>
    DB.batchWrite(request, (error, data) => {
      console.log('batch write', error, data);
      error ? reject(error) : resolve(data)
  }))
};