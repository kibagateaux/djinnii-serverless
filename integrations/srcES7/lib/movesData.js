import {
  _formatToUnix,
  _getTimesInUnix,
  _sortByTime,
  _getFirstMSInDay
} from './time';
import _ from 'lodash';

const normalizeMovesAPILocation = (place) =>
  place ? {id: place.id, ...place.location, type: place.type } : null

const normalizeMovesTrackPoints = (trackPoints) => 
  trackPoints ?
    trackPoints.reduce((points, {time, lat, lon}) => {
      const trackTime = _formatToUnix(time);
      return {...points, [trackTime]: {lat, lon, time:trackTime}}}, {}) : null;

const createLocationsList = (activities) => {
  return activities ? Object.keys(activities).reduce((list, time) => {
    const {trackPoints, activityGroup} = activities[time];
    const placeTime = _.isEmpty(activityGroup.place) ?
      {} : 
      {[activityGroup.startTime]: activityGroup.place}; // if act happened at a specific place track that
    return trackPoints ? {...list, ...trackPoints, ...placeTime} : {...list};
  }, {}) : {}
};

const createActivitiesList = (activities) => {
  // returns object of all the days activities
  // key = unixStartTime, value = activity obj
  const activityList = activities ? 
    activities.reduce((ledger, act) => 
      ({...ledger, [act.startTime]: act}), {}) : {};

  const fillerActs = addFillerSpace(activityList);
  const organizedCompleteList = _sortByTime({...fillerActs, ...activityList}); // organized by time? Expression or reality!?!?
  return organizedCompleteList;
};



const addFillerSpace = (activityList) => {
  let completeList = {}
  const activityTimes = activityList ? Object.keys(activityList) : {};
  // to make FP make last<Array> and take last[0].time instead
  activityTimes.reduce((last, next) => {
    const lastEndTime = activityList[last.time].endTime;
    const nextStartTime = activityList[next].startTime;
    // if new place then update, else use last place
    const place = (activityList[next].activityGroup.place || last.place);
    
    (lastEndTime !== nextStartTime + 1)
      ? completeList[lastEndTime + 1] = {
          startTime: lastEndTime + 1, // start right after last act
          endTime: nextStartTime - 1, // end right before next act
          duration: nextStartTime - lastEndTime,
          activity: 'idl',
          trackPoints: [],
          activityGroup: {
            type: 'filler',
            startTime: lastEndTime + 1,
            endTime: nextStartTime - 1,
            place
          }
        }
      : null
    return {time: next, place};
  }, 
  {time: activityTimes[0], place: {}}); // starter obj for formating
  return completeList
};



const normalizeMovesActivities = (seg) =>
  seg.activities ? seg.activities.map(act => {
    // check that start/end exists, find some way to extrapolate if not
    const actTimes = _getTimesInUnix(act.startTime, act.endTime);
    const segTimes = _getTimesInUnix(seg.startTime, seg.endTime); 
    const trackPoints = Object.keys(normalizeMovesTrackPoints(act.trackPoints));
    return {
      ...act,
      ...actTimes,
      trackPoints: normalizeMovesTrackPoints(act.trackPoints), // :started_at, :included_in, :exercised_at
      activityGroup: { // how will this be portrayed in a graph? Time <- Segment <- Activity -> Time?
        ...segTimes,
        type: seg.type,
        place: normalizeMovesAPILocation(seg.place) || {} // remove because startTime will reference to Locations table
      }
    };
  }) : [];

export const normalizeStorylineData = (stories = []) =>
// should take all day segments and return flatter object
  stories ? stories.map((day) => {
    const {date, lastUpdate, summary} = day;
    const normSeg = day.segments ? day.segments
      .map(seg => normalizeMovesActivities(seg)) // double array being created here
      .filter(seg => seg.length > 0) // gets rid of empty segments
      .reduce((ledger, seg) => ([...ledger, ...seg]), []) : [];

    const unixDate = _getFirstMSInDay(_formatToUnix(date));
    const unixLastUpdate = _formatToUnix(lastUpdate); // last update not changed because we are simply reformatting
    // create activities, and locations timestamp ledger
    const activities = createActivitiesList(normSeg);
    const locations = createLocationsList(activities);

    const actsWithLocationTimereference = _.mapValues(activities, (act) => ({
      ...act,
      trackPoints: act.trackPoints ? Object.keys(act.trackPoints) : [],
      activityGroup: {
        ...act.activityGroup,
        place: act.activityGroup.startTime
      }
    }));

    const dayWithActivities = {
      date: unixDate,
      lastUpdate: unixLastUpdate,
      summary,
      activities: actsWithLocationTimereference,
      locations
    };
    const fullSummary = createDailySummary(dayWithActivities);
    return {...dayWithActivities, summary: fullSummary};
  }) : [];


export const createDailySummary = (day) => {
  const {summary, activities, locations, lastUpdate, date} = day;
  const activityList = activities ? Object.keys(activities) : [];
  const locationList = locations ? Object.keys (locations) : [];
  return {
    summary,
    activities: activityList, // although everything IS an activity it will get exhaustive once adding in purchases, messaging, meals, ect.
    locations: locationList,
    lastUpdate,  // last update not changed because we are simply reformatting
    date
  };
};



