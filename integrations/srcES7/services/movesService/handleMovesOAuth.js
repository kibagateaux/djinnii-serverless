import AWS from 'aws-sdk';
import Moves from 'react-native-moves-api';

const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
const moves = new Moves({
  client_secret: process.env.MOVES_CLIENT_SECRET,
  client_id: process.env.MOVES_CLIENT_ID,
});

// no reason why majority of this code can't be abstracted to general OAuth handleing Lambda which redirects here
export const handleMovesOAuth = (event, context, callback) => {
 const {code, state} = event.query;
 if (code && state) {
   moves.token(code, () => ({})) // callback because I didn't remove require! in library refactor
    .then((res) => {
      const {access_token, refresh_token} = res.data;
      const stateParams = state.split(' ');
      const [redirectId, userId] = stateParams.map((param) => param.split('=')[1]);
      if(userId.length && redirectId.length) {
        const data = {
          userId,
          redirectId,
          integrationName: "Moves",
          accessToken: access_token,
          refreshToken: refresh_token
        };
        const params = {
          FunctionName: "jinni-integrations-dev-updateOAuthTokens", 
          InvocationType: "Event", 
          Payload: JSON.stringify(data),
        };
        lambda.invoke(params, (error, data) => {
          if(error) callback(error, null);
        });
      }

      const redirectError = new Error("[301] JinniIntegrations.Redirect : Resource permanently moved");
      redirectError.name = "https://emochi.app.link";
      callback(redirectError, null);
    })
    .catch((err) => {
      console.log('auth fail', err);
      callback(err);
    });
 } else {
   const noCodeError = new Error("No authorization code or state supplied in query");
   callback(noCodeError, params)
   // init auth process
   // TODO: Fix rn-moves-api moves.authorize to not require exporess
 }
};
