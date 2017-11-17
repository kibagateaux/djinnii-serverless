

export const getNewStoriesFromMoves = (functions, admin) => {
  return functions.https.onRequest((req, res) => {
    const Moves = require('moves');
    const axios = require('axios');
    const _moves = new Moves(functions.config().moves);
    const {uid} = req.body;
    admin.database()
    .ref(`tokens/${uid}/moves`)
    .once('value')
    .then((snapshot) => {
      console.log('token snapshot', snapshot.val());
      const blah = snapshot.val();
      if(blah && blah.access_token){
        _moves.get(
          '/user/storyline/daily?pastDays=3&trackPoints=false',
          blah.access_token,
          function(error, response){
            console.log('getting moves data', response);
            if(error) { console.log('error', error); return error; }
            const data = (response.body != null) ?
              JSON.parse(response.body) :
              "Moves API response did not return data. Check your request or api credentials";
              
            console.log('moves get new story', data);
            
            return res.send(data);
          }
        )
      } else {
        moves.refresh_token(blah.refresh_token, function(error, response, body) {
          // set new access and refresh token
        })
      }
    })
    .catch((err) => {
      console.log("Error on DB query", err);
      axios.get("https://us-central1-djinn-64564.cloudfunctions.net/initMovesOAuth")
        .then((url) => {
          console.log('res auth url', url);
          res.send({statusCode: 200, url})
        })
        .catch((err) => console.log("Error on .catch initMoves", err));
    })
  });
};
