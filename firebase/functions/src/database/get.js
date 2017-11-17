'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getNewStoriesFromMoves = exports.getNewStoriesFromMoves = function getNewStoriesFromMoves(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var Moves = require('moves');
    var axios = require('axios');
    var _moves = new Moves(functions.config().moves);
    var uid = req.body.uid;

    admin.database().ref('tokens/' + uid + '/moves').once('value').then(function (snapshot) {
      console.log('token snapshot', snapshot.val());
      var blah = snapshot.val();
      if (blah && blah.access_token) {
        _moves.get('/user/storyline/daily?pastDays=3&trackPoints=false', blah.access_token, function (error, response) {
          console.log('getting moves data', response);
          if (error) {
            console.log('error', error);return error;
          }
          var data = response.body != null ? JSON.parse(response.body) : "Moves API response did not return data. Check your request or api credentials";

          console.log('moves get new story', data);

          return res.send(data);
        });
      } else {
        moves.refresh_token(blah.refresh_token, function (error, response, body) {
          // set new access and refresh token
        });
      }
    }).catch(function (err) {
      console.log("Error on DB query", err);
      axios.get("https://us-central1-djinn-64564.cloudfunctions.net/initMovesOAuth").then(function (url) {
        console.log('res auth url', url);
        res.send({ statusCode: 200, url: url });
      }).catch(function (err) {
        return console.log("Error on .catch initMoves", err);
      });
    });
  });
};