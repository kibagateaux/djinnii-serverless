const timeLib = require('./time');
const {
  _formatToUnix,
  _durationUnix,
  _getTimesInUnix,
  _sortByTime,
  _getFirstMSInDay
} = timeLib;

const normalizeMovesAPILocation = (place) =>
  place ? {id: place.id, ...place.location, type: place.type } : null

const normalizeMovesAPITrackingPoints = (activity) => 
  activity.trackingPoints ? 
    activity.trackingPoints.map(({time, lat, lon}) => {
      const trackTime = _formatToUnix(time);
      return {[time]: {lat, lon}}}) : null;

const normalizeActivities = (seg) =>
  seg.activities ? seg.activities.map(act => {
    const actTimes = _getTimesInUnix(act.startTime, act.endTime);
    segTimes = _getTimesInUnix(seg.startTime, seg.endTime);
    const normAct = {
      ...act,
      ...actTimes,
      trackingPoints: normalizeMovesAPITrackingPoints(act),
      activityGroup: {
        ...segTimes,
        type: seg.type,
        place: normalizeMovesAPILocation(seg.place)
      }
    }
    return normAct;
  }) : [];

const addFillerSpace = (activityList) => {
  let completeList = {}
  const activityTimes = Object.keys(activityList)
  // to make FP make last<Array> and take last[0].time instead
  activityTimes.reduce((last, next) => {
    const endTime = activityList[last.time].endTime;
    const startTime = activityList[next].startTime;

    // if new place update, else use last place
    const place = (activityList[next].activityGroup.place || last.place);
    
    (endTime !== startTime + 1)
      ? completeList[endTime + 1] = {
          startTime: endTime + 1, // start right after last act
          endTime: startTime - 1, // end right before next act
          duration: startTime - endTime,
          activity: 'idl',
          place,
          activityGroup: {
            type: 'filler',
            startTime: endTime + 1,
            endTime: startTime - 1
          }
        }
      : null
    return {time: next, place};
  }, 
  {time: activityTimes[0], place: activityList[activityTimes[0]].activityGroup.place}); // starter obj
  return completeList
};

module.exports.createActivitiesList = (stories) => {
  // returns object of all the days activities
  // key = unixStartTime, value = activity obj
  let activityList = {};
  stories.map((day) => {
    day.activityGroups.map((seg) => {
      seg.activities.map((act) => {
        const startTime = act.startTime
        activityList[startTime] = act;  
      });
    });
  });
  const fillerActs = addFillerSpace(activityList);
  const organizedCompleteList = _sortByTime({...fillerActs, ...activityList});
  // organized by time? Expression or reality!?!?
  return organizedCompleteList;
};

module.exports.normalizeStorylineData = (stories) =>
// should take all day segments and return flat object
  stories.map((day) => {
    const {date, calories, lastUpdate, summary} = day
    const normSeg = day.segments.map(seg => {
      const {startTime, endTime, type} = seg;
      const segmentTime = _getTimesInUnix(startTime, endTime);
      const activities = normalizeActivities(seg);

      // console.log('norm story', activities);
      // segmentActivity = activities.length > 0 ? activities[0].activity : 'idl';
      // const meta = {type:seg.type, ...segmentTime, activity: segmentActivity};
      // const normData = {
      //   meta,
      //   activities
      // }

      // normalize track points so timestamp is key for lat/long
      return activities
    });
    const unixDate = _getFirstMSInDay(_formatToUnix(date));
    const unixLastUpdate = _formatToUnix(lastUpdate);
    return {date, lastUpdate, summary, activityGroups: normSeg};
  });
