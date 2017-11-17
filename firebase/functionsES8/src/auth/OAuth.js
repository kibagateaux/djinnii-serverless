
export const setMovesApiToken = (functions, admin) => {
  return functions.https.onRequest((req, res) => {
    const { access_token, refresh_token, uid } = body;
    const tokens = {
      accessToken: access_token,
      refreshToken: refresh_token
    };
    const tokenRef = admin.database().ref(`/tokens/${uid}/moves`)
    tokenRef
      .set(tokens)
      .then((snapshot) => {
        console.log('post moves token snap', snapshot.value, snapshot.val());
        res.send(snapshot.val());
      })
      .catch((err) => {
        console.log('err uploading moves token', err)
      }) 
  });
};

export const initMovesOAuth = (functions, admin) =>
  functions.https.onRequest((req, res) => {
    const Moves = require('moves');
    const _moves = new Moves(functions.config().moves);
    if(req.query.code){
      _moves.token(req.query.code, (error, data, body) => {
        const {access_token, refresh_token} = JSON.parse(data.body);
        res.status(303).redirect(`djinnii://auth/moves/&access_token=${access_token}&refresh_token=${refresh_token}`);
      });
    }
  });

// How to set environment variables on functions cloud?

/* should really save to ref('tokens/{id}/moves')*/
/* can easily be changed to setAuthToken with ref('tokens/{id}/{provider}) */