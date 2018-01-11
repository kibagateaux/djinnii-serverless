import AWS from 'aws-sdk';
import Fitbit from 'fitbit-node';

const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
const fitbit = new Fitbit(
  process.env.FITBIT_CLIENT_ID,
  process.env.FITBIT_CLIENT_SECRET
);

import {blobify} from '../../lib/helpers';
import {DB, batchWrite} from '../../lib/database';
import _ from 'lodash';

const Lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
// Set pastDays query param to 1 and have scheduled invocation of this lambda every day 
// this is so data is updated even if thy don't have to app and adds discrete discipline to data management 

export const getFitbitActivities = (event, context, callback) => {
  const {userId, accessToken} = event.pathParameters; // add days param
  if(userId) {
    const queryParams = {
      TableName: process.env.DYNAMODB_META_DATA_TABLE, // pull tokens from user_meta_data talbe
      Key: {userId}
      // add  getAttributes : integrations -> moves
    };
    DB.get(queryParams, (error, results) => {
      if (!error && results.Item) {
        // const {accessToken, refreshToken} = results.Item.integrations ? 
        //   results.Item.integrations.fitbit : {}; // add lastUpdateAt. only update if > 8 hours or something
        if (accessToken) {
          fitbit.get("/profile.json", accessToken)
            .then((data) => {
              console.log('data', data);
              callback(null, data)
            })
            .catch((error) => {
              console.log('eror', error);
              callback(error, null);
            })
        }
      }
    });
  }
};