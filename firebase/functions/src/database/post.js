'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var updateMovesStoryline = exports.updateMovesStoryline = function updateMovesStoryline(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var _req$body = req.body,
        uid = _req$body.uid,
        storylines = _req$body.storylines;

    console.log('updated storylines', uid, storylines);
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database().ref('users/' + req.params.uid).update(storylines).then(function (snapshot) {
      console.log('snapshot', snapshot);
      res.send(snapshot.val());
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      // res.redirect(303, snapshot.ref);
    });
  });
};

var normalizeMovesStorylineData = exports.normalizeMovesStorylineData = function normalizeMovesStorylineData(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var moment = 'moment';
    var storylines = req.body.storylines;


    var normalizedData = function normalizedData(stories) {
      // should take all day segments and return flat object
      return stories.map(function (day) {
        var normSeg = day.segments.map(function (seg) {
          var startTime = seg.startTime,
              endTime = seg.endTime,
              type = seg.type;

          var segmentTime = _getTimesInUnix(startTime, endTime);
          var activities = normalizeActivities(seg.activities);
          segmentActivity = activities.length > 0 ? activities[0].activity : 'idl';
          var meta = Object.assign({
            type: seg.type,
            activity: segmentActivity
          }, segmentTime);
          var normData = { meta: meta, activities: activities };
          console.log('normData', normData);

          return seg.type === 'place' ? Object.assign({}, normData, seg.place) : normData;
        });
        day.segments = normSeg;
        console.log('norm day', day);

        return day;
      });
    };
  });
};

var normalizeActivities = exports.normalizeActivities = function normalizeActivities(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var activities = req.body.activities;

    return activities ? activities.map(function (act) {
      var time = _getTimesInUnix(act.startTime, act.endTime);
      var normAct = Object.assign({}, act, time);
      return normAct;
    }) : [];
  });
};
var createActivitiesList = exports.createActivitiesList = function createActivitiesList(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var storylines = req.body.storylines;

    var activityList = {};
    storylines.map(function (day) {
      day.segments.map(function (seg) {
        seg.activities.map(function (act) {
          var startTime = act.startTime;
          activityList[startTime] = act;
        });
      });
    });

    //replace with function api call
    var fillerActs = addFillerSpace(activityList);
    return Object.assign({}, fillerActs, activityList);
    // doesn't need to be organized by time. Expression not reality!
  });
};

var addFillerSpace = exports.addFillerSpace = function addFillerSpace(functions, admin) {
  return functions.https.onRequest(function (req, res) {
    var data = req.body.data;

    var completeList = {};
    Object.keys(body).reduce(function (last, next) {
      var lastAct = activityList[last];var nextAct = activityList[next];
      lastAct.endTime !== nextAct.startTime + 1 ? completeList[lastAct.endTime + 1] = {
        startTime: lastAct.endTime + 1,
        endTime: nextAct.startTime - 1,
        duration: nextAct.startTime - lastAct.endTime,
        activity: 'idl'
      } : null;
      return next;
    });
    return completeList;
  });
};