const moves = require('moves');
const AWS = require('aws-sdk');
const movesHelpers = require('../../lib/movesData');
const {
  createActivitiesList,
  normalizeStorylineData
} = movesHelpers;

AWS.config.update({
  region: "us-east-1"
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const movesAuthInitUrl = `https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id=${MOVES_API_KEY}&scope=activity+location`;

module.exports.getMovesStorylineData = (event, context) => {
  const userId = event.pathParameters.userId;
  const queryParams = {
    table: process.env.DYNAMODB_TOKENS_TABLE,
    Key: {
      userId
    }
  };
  dynamoDb.getItem(params, (error, results) => {
    if(error) {
      console.log('moves storyline fetch user tokens failed', error)      
    } else if (results.moves) {   // if has tokens get data 
      const {access_token, refresh_token} = results.moves
      const moves = new Moves({
        client_id: process.env.MOVES_API_KEY,
        access_token,
        refresh_token
      });
    
      moves.get('/user/storyline/daily?pastDays=7&trackPoints=true')
        .then((response) => {
          const norms = normalizeStorylineData(response.data)
          const newActivities = createActivitiesList(norms);
          console.log('get moves store', norms, newActivities);
          // update activities table
          // call recalculate stats from timestamp
            // need DAYS table that has summary and references to activities, stats, and meals with timekeys
        })
        .catch((error) => {
          console.log('moves storyline fetch data failed', error)
        })
    } else {
      console.log('get moves tokens null', results);
      // no moves tokens, return error to init OAuth
     }
  })
}