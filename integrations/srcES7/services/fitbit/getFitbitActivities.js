import AWS from 'aws-sdk';
import Fitbit from 'fitbit-node';
import moment from 'moment';

const fitbit = new Fitbit(
  process.env.FITBIT_CLIENT_ID,
  process.env.FITBIT_CLIENT_SECRET
);

import {blobify} from '../../lib/helpers';
import {DB, batchWrite} from '../../lib/database';
import _ from 'lodash';

// Set pastDays query param to 1 and have scheduled invocation of this lambda every day 
// this is so data is updated even if thy don't have to app and adds discrete discipline to data management 

export const getFitbitActivities = (event, context, callback) => {
  const {userId} = event.pathParameters; // add days param
  if(userId) {
    const queryParams = {
      TableName: process.env.DYNAMODB_META_DATA_TABLE, // pull tokens from user_meta_data talbe
      Key: {userId}
      // add  getAttributes : integrations -> moves
    };
    DB.get(queryParams, (error, results) => {
      if (!error && results.Item) {
        const {accessToken, refreshToken} = results.Item.integrations ? 
          results.Item.integrations.Fitbit || {} : {};
        if (accessToken) {
          const {beforeDate} = event.pathParameters;
          const dateParam = "&beforeDate=" + 
            (Boolean(Number(beforeDate)) ? // only accepts unix times like all services
              moment(Number(beforeDate)).format("YYYY-MM-DD") :
              moment().format("YYYY-MM-DD"));

          fitbit.get("/activities/list.json?offset=0&sort=desc&limit=20"+dateParam, accessToken)
            .then((res) => {
              const recentActivities = res.pop().body;
              console.log('res', res[0].errors, recentActivities);
              // normalize Fitbit data and upload to DB;
              callback(null, recentActivities.activities);
            })
            .catch((error) => {
              console.log('Fitbit error', error);
              callback(error, null);
            })
        }
      } else {
        console.log('Dynamo error', error);
        callback(error, null);
      }
   })
  }
};