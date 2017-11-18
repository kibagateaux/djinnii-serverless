import Moves from 'moves';
import AWS from 'aws-sdk';
import {
  createActivitiesList,
  createDailyLedger,
  normalizeStorylineData
} from '../../lib/movesData';

import {
  blobify
} from '../../lib/helpers';
import {
  DB, 
  batchPut,
} from '../../lib/database';

// const movesAuthInitUrl = `https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id=${process.env.MOVES_API_KEY}&scope=activity+location`;

export const getMovesStorylineData = (event, context) => {
  const userId = event.pathParameters.userId;
  if(userId) {
    const queryParams = {
      TableName: process.env.DYNAMODB_TOKENS_TABLE || "djinii-mobilehub-1897344653-Tokens",
      Key: {
        userId: userId
      }
    };
    DB.get(queryParams, (error, results) => {
      if(error) {
        console.log('moves storyline fetch user tokens failed', error)      
        context.done(error);      
      } else if (results.Item && results.Item.moves) {   // if has tokens get data 
        const {access_token, refresh_token} = results.Item.moves
        const moves = new Moves({
          client_id: process.env.MOVES_API_KEY || "kdiz90L264WQ72Sc7OO0_0IUM4ZRrcB6",
          access_token,
          refresh_token
        });
      
        moves.get('/user/storyline/daily?pastDays=7&trackPoints=true')
          .then((response) => {
            const normalizedData = normalizeStorylineData(response.data)

            const newData = ["activities", "stats", "locations"]
              .reduce((newData, key) => ({
                ...newData, 
                [key]: normalizedData.reduce((ledger, day) => 
                  ({...ledger, ...day[key]}))})
              , {}); // compiles full list of new data from each day to update to DB
            const dbTables = {
              activities: "djinii-mobilehub-1897344653-Activities",
              locations: "djinii-mobilehub-1897344653-Locations",
              stats: "djinii-mobilehub-1897344653-stats"
            };
            const dbWrites = Object.keys(newData).map((resource) => {
              const data = newData[resource]
              const ledger = Object.keys(data).map((time) => data[time]);
              const blobs = blobify(ledger);
              const table = dbTables[resource];
              return (blobs[0][0].length > 0) ? 
                blobs.map((blob) => batchPut(table, blob, "+13472418464")) : null;
            });

            // don't think using results from writes is useful but this is how to handle it
            // .reduce((writes, put) => [...writes, ...put], []);
            // Promise.all(dbWrites)
            //   .then((result) => console.log('dbwrite res', result))
            //   .catch((error) => console.log('write err', error))


            // const newActivities = normalizedData.reduce((ledger, day) => {
            //   const acts = Object.keys(day.activities).map((time) => day.activities[time])
            //   return [...ledger, ...acts];
            // }, []);
            // const actBlobs = blobify(newActivities)
            // const writes = Promise.all(actBlobs.map((blob) => 
            //   batchPut("djinii-mobilehub-1897344653-Activities", blob, "+13472418464")));

            // writes.then((results) => {
            //   console.log('writes res', results);
            // })
            // .catch((error) => {
            //   console.log('write err', error);
            // })

            // call recalculate stats from timestamp
            context.done(null, {})
          })
          .catch((error) => {
            console.log('moves storyline fetch data failed', error)
            context.done(error)
          })
      } else {
        console.log('get moves tokens null', results);
        context.done(error)
        // no moves tokens, return error to init OAuth
      }
    })
  }
}