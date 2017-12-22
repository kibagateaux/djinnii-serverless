import {
  _formatToUnix,
  _getTimesInUnix,
  _sortByTime,
  _getFirstMSInDay
} from './time';
import _ from 'lodash';

const normalizeMovesAPILocation = (place) => (time) =>
  _.isEmpty(place) ? {} : {[time]: {time, id: place.id, ...place.location, category: place.type }}

const normalizeMovesTrackPoints = (trackPoints) => 
  trackPoints ?
    trackPoints.reduce((points, {time, lat, lon}) => {
      const trackTime = _formatToUnix(time);
      return {...points, [trackTime]: {lat, lon, time:trackTime}}}, {}) : null;

const createLocationsList = (activities) => {
  return activities ? Object.keys(activities).reduce((list, time) => {
    const {trackPoints = {}, place = {}} = activities[time];
    return {...list, ...trackPoints, ...place};
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
  activityTimes.reduce((last, next) => {
    const lastEndTime = activityList[last.time].endTime;
    const nextStartTime = activityList[next].startTime;
    // if new place then update, else use last place
    const place = (activityList[next].place || last.place);
    
    (lastEndTime !== nextStartTime + 1)
      ? completeList[lastEndTime + 1] = {
          startTime: lastEndTime + 1, // start right after last act
          endTime: nextStartTime - 1, // end right before next act
          duration: nextStartTime - lastEndTime,
          activity: "idle",
          trackPoints: {},
          place,
          source: "filler"
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
    return {
      ...act,
      ...actTimes,
      trackPoints: normalizeMovesTrackPoints(act.trackPoints),
      place: normalizeMovesAPILocation(seg.place)(segTimes.startTime) || {},
      source: "moves"
    };
  }) : [];

export const normalizeStorylineData = (stories = []) =>
  // should take all day segments and return flat object
  stories ? stories.map((day) => {
    const {date, lastUpdate, summary} = day;
    const normSeg = day.segments ? day.segments
      .map(seg => normalizeMovesActivities(seg))
      .filter(seg => seg.length > 0) // gets rid of empty segments
      .reduce((ledger, seg) => ([...ledger, ...seg]), []) : [];

    const unixDate = _getFirstMSInDay(_formatToUnix(date));
    // last update not changed because we are simply reformatting
    const unixLastUpdate = _formatToUnix(lastUpdate);

    // create activities, and locations timestamp ledger
    const activities = createActivitiesList(normSeg);
    const locations = createLocationsList(activities);

    // replaces location objects from original activity with timestamp references
    const actsWithLocationTimereference = _.mapValues(activities, (act) => ({
      ...act,
      trackPoints: act.trackPoints ? Object.keys(act.trackPoints) : [],
      place: act.place.time
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
    activities: activityList,
    locations: locationList,
    lastUpdate,
    date
  };
};



