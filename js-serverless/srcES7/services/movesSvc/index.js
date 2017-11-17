import Moves from 'moves';
import AWS from 'aws-sdk';
import {
  createActivitiesList,
  normalizeStorylineData
} from '../../lib/movesData';

AWS.config.update({
  region: "us-east-1"
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// const movesAuthInitUrl = `https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id=${process.env.MOVES_API_KEY}&scope=activity+location`;

export const getMovesStorylineData = (event, context) => {
  const userId = event.pathParameters.userId;
  const queryParams = {
    TableName: process.env.DYNAMODB_TOKENS_TABLE || "djinii-mobilehub-1897344653-Tokens",
    Key: {
      userId: "+13472418464"
    }
  };
  dynamoDb.get(queryParams, (error, results) => {
    if(error) {
      console.log('moves storyline fetch user tokens failed', error)      
      context.done(error);      
    } else if (results.Item.moves) {   // if has tokens get data 
      const {access_token, refresh_token} = results.Item.moves
      const moves = new Moves({
        client_id: process.env.MOVES_API_KEY || "kdiz90L264WQ72Sc7OO0_0IUM4ZRrcB6",
        access_token,
        refresh_token
      });
    
      moves.get('/user/storyline/daily?pastDays=7&trackPoints=true')
        .then((response) => {
          const normalizeData = normalizeStorylineData(response.data)
          // console.log('norm moves data', normalizeData);
          context.done(null, normalizeData)
          const newActivities = createActivitiesList(normalizeData);
          console.log('moves actlist', newActivities);
          // update activities table
          // call recalculate stats from timestamp
            // need DAYS table that has summary and references to activities, stats, and meals with timekeys
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