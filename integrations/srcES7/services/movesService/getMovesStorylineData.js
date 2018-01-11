import AWS from 'aws-sdk';
import Moves from 'react-native-moves-api';
import {
  createDailySummary,
  normalizeStorylineData
} from '../../lib/movesData';
import {blobify} from '../../lib/helpers';
import {DB, batchWrite} from '../../lib/database';
import _ from 'lodash';

const Lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
// Set pastDays query param to 1 and have scheduled invocation of this lambda every day 
// this is so data is updated even if thy don't have to app and adds discrete discipline to data management 

export const getMovesStorylineData = (event, context, callback) => {
  const {userId, daysToUpdate = 7} = event.pathParameters; // add days param
  console.log('userId', userId, daysToUpdate);
  if(userId) {
    const queryParams = {
      TableName: process.env.DYNAMODB_META_DATA_TABLE, // pull tokens from user_meta_data talbe
      Key: {userId}
      // add  getAttributes : integrations -> moves
    };
    DB.get(queryParams, (error, results) => {
      if (!error && results.Item) {
        console.log('get moves', results.Item.integrations.moves, results.Item.integrations.Moves);
        const {accessToken, refreshToken} = results.Item.integrations ? 
          results.Item.integrations.moves : {}; // add lastUpdateAt. only update if > 8 hours or something
        if (accessToken) {
          const moves = new Moves({
            client_id: process.env.MOVES_CLIENT_ID,
            access_token: accessToken,
            refresh_token: refreshToken
          });
          moves.get(`/user/storyline/daily?pastDays=${daysToUpdate}&trackPoints=true`)
            .then((res) => {
              const normalizedData = normalizeStorylineData(res.data)
              // FIXME send normalized data to diffing functions instead of everything below e.g. stats calculation and updating DB directly
              
              const resources = ["activities", "locations"];
              const aggregatedDataByResource = resources
                .reduce((newData, resource) => ({
                  ...newData, 
                  [resource]: normalizedData.reduce((ledger, day) => ({
                    ...ledger, ...day[resource]}), {})
                }), {}); // compiles full list of new data from each day to update to DB

              const dbWrites = resources.map((resource) => {
                const data = aggregatedDataByResource[resource];
                const ledger = Object.keys(data).map((time) => data[time]);
                const blobs = blobify(ledger);
                const table = process.env[`DYNAMODB_${_.toUpper(resource)}_TABLE`];
                return (blobs[0].length > 0) ? // checks that there is at least one item to put
                  blobs.map((blob) => batchWrite(table, blob, userId)) : null;
              });

              // don't think using results from writes is useful but this is how to handle it
              // .reduce((ledger, writes) => [...ledger, ...writes], []);
              // Promise.all(dbWrites)
              //   .then((result) => console.log('dbwrite res', result))
              //   .catch((error) => console.log('write err', error))
    
              const response = {
                isBase64Encoded: false,
                statusCode: 200,
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Request-Method": "GET",
                  "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify(normalizedData),
              };
              callback(null, response);
            })
            .catch((error) => {
              console.log('moves storyline fetch data failed', error)
              callback(error)
            })
        } else {
          // they haven't authenticated Moves yet so use my personal data to fake it
          // const invokeParams = {

          // };
          // Lambda.invokeAsync(params, (error, results) => {

          // })
        }
        
      } else {
        console.log('get moves tokens failed', error, results);
        callback(error)
        // no moves tokens, return error to init OAuth
      }
    });
  }
};