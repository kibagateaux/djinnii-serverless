import AWS from 'aws-sdk';
import Moves from 'moves';
import _ from 'lodash';
import {
  createActivitiesList,
  createDailyLedger,
  normalizeStorylineData
} from '../../lib/movesData';
import {blobify} from '../../lib/helpers';
import {DB, batchPut} from '../../lib/database';


export const getMovesStorylineData = (event, context) => {
  const {userId} = event.pathParameters;
  if(userId) {
    const queryParams = {
      TableName: process.env.DYNAMODB_TOKENS_TABLE,
      Key: {userId: "+13472418464"}
    };
    DB.get(queryParams, (error, results) => {
    if (!error && results.Item && results.Item.moves) {  // if has tokens get data 
      const {access_token, refresh_token} = results.Item.moves; // add lastDataUpdate. only update if > 8 hours or something
      const moves = new Moves({
        client_id: process.env.MOVES_API_KEY || "kdiz90L264WQ72Sc7OO0_0IUM4ZRrcB6", // manually added in AWS console not in .yaml file
        access_token,
        refresh_token
      });
    
      moves.get('/user/storyline/daily?pastDays=7&trackPoints=true')
        .then((response) => {
          const normalizedData = normalizeStorylineData(response.data)
          // FIXME send normalized data to diffing functions instead of everything below e.g. stats calculation and updating DB directly
          
          // call recalculate stats from timestamp
          
          const newData = ["activities", "stats", "locations"]
            .reduce((newData, key) => ({
              ...newData, 
              [key]: normalizedData.reduce((ledger, day) => 
                ({...ledger, ...day[key]}))})
            , {}); // compiles full list of new data from each day to update to DB
          

          const dbWrites = Object.keys(newData).map((resource) => {
            const data = newData[resource];
            const ledger = Object.keys(data).map((time) => data[time]);
            const blobs = blobify(ledger);
            const table = process.env[`DYNAMODB_${_.toUpper(resource)}_TABLE`];
            return (blobs[0].length > 0) ? // checks that there is at least one item to put
              blobs.map((blob) => batchPut(table, blob, userId)) : null;
          });

          // don't think using results from writes is useful but this is how to handle it
          // .reduce((ledger, writes) => [...ledger, ...writes], []);
          // Promise.all(dbWrites)
          //   .then((result) => console.log('dbwrite res', result))
          //   .catch((error) => console.log('write err', error))
          context.done(null, {}) // end lambda invocation so no timeout
        })
        .catch((error) => {
          console.log('moves storyline fetch data failed', error)
          context.done(error)
        })
      } else {
        console.log('get moves tokens failed', error, results);
        context.done(error)
        // no moves tokens, return error to init OAuth
      }
    });
  }
};