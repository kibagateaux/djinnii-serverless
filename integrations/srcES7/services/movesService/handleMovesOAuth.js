import AWS from 'aws-sdk';
import Moves from 'react-native-moves-api';
import axios from 'axios';
const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
const moves = new Moves({
  client_secret: process.env.MOVES_CLIENT_SECRET,
  client_id: process.env.MOVES_CLIENT_ID,
});

// no reason why majority of this code can't be abstracted to general OAuth handleing Lambda which redirects here
export const handleMovesOAuth = (event, context, callback) => {
 const params = event.queryStringParameters || {};
 const {code, state} = params;
 if (code && state) {
   moves.token(code, () => ({})) // callback because I didn't remove require! in library refactor
    .then((res) => {
      const {access_token, refresh_token} = res.data;
      const stateParams = state.split(' ');
      const [redirectId, userId] = stateParams.map((param) => param.split('=')[1]);
      const data = {
        userId,
        redirectId,
        integrationName: "moves",
        accessToken: access_token,
        refreshToken: refresh_token
      };

      if(userId.length && redirectId.length) {
        var params = {
          FunctionName: "jinni-integrations-dev-updateOAuthTokens", 
          InvocationType: "Event", 
          Payload: JSON.stringify(data),
         };
         // this fails in local testing because of time offsets
        lambda.invoke(params, (error, data) => {
          if(!error) {
            console.log('handle moves success', data);
            const response = {
              statusCode: 303,
              headers: {location: "https://malikwormsby.com"}, // FIXME: get deeplinks to work
              data: {}
            }
            callback(null, response)
          } else {
            callback(error, null)
            console.log('update tokens error', error);
          }
        });

        // For dev testing
        // axios.post("http://localhost:3000/updateTokens", data)
        //   .then((result) => {
        //     console.log('Moves done updating tokens');
        //   })
        //   .catch((error) => {
        //     console.log('Moves error updating tokens', error);
        //   });
      }
    })
    .catch((err) => {
      console.log('auth fail', err);
      callback(err);
    });
 } else {
   const noCodeError = new Error("No authorization code supplied in query");
   callback(noCodeError, params)
   // init auth process
   // TODO: Fix rn-moves-api moves.authorize to not require exporess
 }
};
