import AWS from 'aws-sdk';
import Fitbit from 'fitbit-node';
import axios from 'axios';

const lambda = new AWS.Lambda({apiVersion: '2015-03-31'});
const fitbit = new Fitbit(
  process.env.FITBIT_CLIENT_ID,
  process.env.FITBIT_CLIENT_SECRET
);

// no reason why majority of this code can't be abstracted to general OAuth handleing Lambda which redirects here
export const handleFitbitOAuth = (event, context, callback) => {
 const {code, state} = event.query;
 if (code && state) {
   const huh = fitbit.getAccessToken(code, "https://emochi.app.link")
    .then((res) => {
      const {access_token, refresh_token} = res;
      axios.get("http://localhost:3000/fitbit/activities/3472418464/"+access_token)

      const stateParams = state.split(' ');
      const [redirectId, userId] = stateParams.map((param) => param.split('=')[1]);
      if(userId.length && redirectId.length) {
        const data = {
          userId,
          integrationId: res.userId,
          redirectId,
          integrationName: "Fitbit",
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
   callback(noCodeError, null)
   // init auth process
   // TODO: Fix rn-moves-api moves.authorize to not require exporess
 }
};
