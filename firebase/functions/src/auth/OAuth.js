'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var setMovesApiToken = exports.setMovesApiToken = function setMovesApiToken(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var _body = body,
        access_token = _body.access_token,
        refresh_token = _body.refresh_token,
        uid = _body.uid;

    var tokens = {
      accessToken: access_token,
      refreshToken: refresh_token
    };
    var tokenRef = admin.database().ref('/tokens/' + uid + '/moves');
    tokenRef.set(tokens).then(function (snapshot) {
      console.log('post moves token snap', snapshot.value, snapshot.val());
      res.send(snapshot.val());
    }).catch(function (err) {
      console.log('err uploading moves token', err);
    });
  });
};

var initMovesOAuth = exports.initMovesOAuth = function initMovesOAuth(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var Moves = require('moves');
    var _moves = new Moves(functions.config().moves);
    if (req.query.code) {
      _moves.token(req.query.code, function (error, data, body) {
        var _JSON$parse = JSON.parse(data.body),
            access_token = _JSON$parse.access_token,
            refresh_token = _JSON$parse.refresh_token;

        res.status(303).redirect('djinnii://auth/moves/access_token=' + access_token + '&refresh_token=' + refresh_token);
      });
    }
  });
};

// How to set environment variables on functions cloud?

/* should really save to ref('tokens/{id}/moves')*/
/* can easily be changed to setAuthToken with ref('tokens/{id}/{provider}) */