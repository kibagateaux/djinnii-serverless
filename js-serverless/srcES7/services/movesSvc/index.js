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
  const queryParams = {
    TableName: process.env.DYNAMODB_TOKENS_TABLE || "djinii-mobilehub-1897344653-Tokens",
    Key: {
      userId: "+13472418464"
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
          const newActivities = createActivitiesList(normalizedData);
          const dailySummaries = createDailyLedger(normalizedData);
          // console.log('new acts', newActivities);
          const actBlobs = blobify(newActivities);
          // console.log('acts to update', actBlobs);
          const activitiesTable = "djinii-mobilehub-1897344653-Activities"; // FIXME: env var
          const writes = Promise.all(actBlobs.map((blob) => batchPut(activitiesTable, blob, "+13472418464")));
          writes.then((results) => {
            console.log('writes res', results);
          })
          .catch((error) => {
            console.log('write err', error);
          })
          // update activities table
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