import AWS from 'aws-sdk';
import Moves from 'react-native-moves-api';
import _ from 'lodash';

const moves = new Moves({
  client_secret: process.env.MOVES_CLIENT_SECRET,
  client_id: process.env.MOVES_CLIENT_ID,
});

export const initMovesOAuth = (event, context, callback) => {
 const params = event.queryStringParameters || {};
 const {code, state} = params;
 if (code) {
   // handle initial auth response
   moves.token(code, () => ({}))
    .then((res) => {
      console.log('auth success', res.data); // code below can be extracted to general OAuth handler before being directed to initMoves via Lambda
      const stateParams = state.split(' ');
      const [redirectId, userId] = stateParams.map((param) => param.split('=')[1]);
      if(userId.length && redirectId.length) {
        console.log('update tokens', );
        // update Tokens
      }
      const response = {
        statusCode: 303,
        headers: {
          location: "djinnii://moves/init-auth"
        },
        data: res.data
      }
      callback(null, response)
    })
    .catch((err) => {
      console.log('auth fail', err);
      callback(err);
    });
 } else {
  // init auth process
  // TODO: Fix rn-moves-api moves.authorize to not require exporess
 }
  // if event.query.code
    // pull code from query params
    // moves.token(code, cb);
    // redirect to self with reirectId and userId
  // if event.query.tokens
    // setOAuthTokens with userId
    // redirect to app with redirectIds
}

export const handleMovesTokens = (event,context,callback) => {
  console.log('handle move tokens event', event);
}