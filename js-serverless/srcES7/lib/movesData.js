import {
  _formatToUnix,
  _getTimesInUnix,
  _sortByTime,
  _getFirstMSInDay
} from './time';

const normalizeMovesAPILocation = (place) =>
  place ? {id: place.id, ...place.location, type: place.type } : null

const normalizeMovesTrackPoints = (trackPoints) => 
  trackPoints ? 
    trackPoints.reduce((points, {time, lat, lon}) => {
      const trackTime = _formatToUnix(time);
      return {...points, [trackTime]: {lat, lon}}}, {}) : null;


const normalizeMovesActivities = (seg) =>
  seg.activities ? seg.activities.map(act => {
    // check that start/end exisits, find some way to extrapolate if not
    const actTimes = _getTimesInUnix(act.startTime, act.endTime);
    const segTimes = _getTimesInUnix(seg.startTime, seg.endTime);
    const normAct = {
      ...act,
      ...actTimes,
      trackPoints: normalizeMovesTrackPoints(act.trackPoints),
      activityGroup: {
        ...segTimes,
        type: seg.type, 
        place: normalizeMovesAPILocation(seg.place)
      }
    };
    return normAct;
  }) : [];

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
          place,
          activityGroup: {
            type: 'filler',
            startTime: lastEndTime + 1,
            endTime: nextStartTime - 1
          }
        }
      : null
    return {time: next, place};
  }, 
  {time: activityTimes[0], place: activityList[activityTimes[0]].place || {}}); // starter obj for formating
  return completeList
};

export const createActivitiesList = (stories) => {
  // returns object of all the days activities
  // key = unixStartTime, value = activity obj
  let activityList = {};
  // turn this into nested reduce for FP or map with reduce and then reduce that
  stories ? stories.map((day) => {
    day.activities.map((act) => {
      if(act.startTime) activityList[act.startTime] = act
    });
  }) : {};
  const fillerActs = addFillerSpace(activityList);
  const organizedCompleteList = _sortByTime({...fillerActs, ...activityList});
  // organized by time? Expression or reality!?!?
  return organizedCompleteList;
};

export const normalizeStorylineData = (stories) =>
// should take all day segments and return flat object
  stories ? stories.map((day) => {
    const {date, lastUpdate, summary} = day
    const normSeg = day.segments
      .map(seg => normalizeMovesActivities(seg)) // double array being created here
      .filter(seg => seg.length > 0)
      .reduce((ledger, seg) => {
        return [...ledger, ...seg]
      }, []);; // gets rid of empty segments

    const unixDate = _getFirstMSInDay(_formatToUnix(date));
    const unixLastUpdate = _formatToUnix(lastUpdate); // last update not changed because we are simply reformatting
    return {date: unixDate, lastUpdate: unixLastUpdate, summary, activities: normSeg};
  }) : [];


export const createDailyLedger = (stories) => {
  return stories ? stories.map((day) => {
    const {summary, activities, lastUpdate, date, stats} = day;
    const activityList = activities ?
      activities.reduce((ledger, act) => [...ledger, act.startTime], [])
      : [];
    const statsList = stats ? Object.keys(stats) : [];
    const locationList = createLocationLedger(activities);
    return {
      stats: statsList,
      activities: activityList, // although everything IS an activity it will get exhaustive once adding in purchases, messaging, meals, ect.
      locations: locationList,
      summary,
      lastUpdate,  // last update not changed because we are simply reformatting
      date
    };
  }) : [];
};

const createLocationLedger = (activities) =>
  activities ? activities.reduce((ledger, act) => {
    const locationTimes = act.trackPoints ? Object.keys(act.trackPoints) : [];
    const nonDuplicateLocations = locationTimes.filter((time) => ledger.indexOf(time) !== -1)
    return [...ledger, ...locationTimes];
  }, []) : [];

