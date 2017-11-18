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
      return {...points, [trackTime]: {lat, lon, time:trackTime}}}, {}) : null;

const createLocationLedger = (activities) =>
  activities ? Object.keys(activities).reduce((ledger, time) => {
    const act = activities[time];
    const locationTimes = act.trackPoints ? Object.keys(act.trackPoints) : [];
    const nonDuplicateLocations = locationTimes.filter((time) => ledger.indexOf(time) !== -1)
    return [...ledger, ...locationTimes];
  }, []) : [];

const createLocationsList = (activities) => {
  return activities ? Object.keys(activities).reduce((list, time) => {
    const act = activities[time];
    return act.trackPoints ? {...list, ...act.trackPoints} : {...list};
  }, {}) : {}
};

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

export const createActivitiesList = (activities) => {
  // returns object of all the days activities
  // key = unixStartTime, value = activity obj
  const activityList = activities ? 
    activities.reduce((ledger, act) => 
      ({...ledger, [act.startTime]: act}), {}) : {};

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
    const activities = createActivitiesList(normSeg);
    const locations = createLocationsList(activities);
    // const stats = createStatsList(activities); // complicated because needs to pull stats from DB to incorp other API stats

    // create activities, stats, and locations timestamp list overview
    const dayWithActivities = {
      date: unixDate,
      lastUpdate: unixLastUpdate,
      summary,
      activities,
      locations
    };
    const fullSummary = createDailyLedger(dayWithActivities);
    return {...dayWithActivities, summary: fullSummary};
  }) : [];


export const createDailyLedger = (day) => {
  const {summary, activities, lastUpdate, date, stats} = day;
  const activityList = activities ? Object.keys(activities) : [];
  const statsList = stats ? Object.keys(stats) : [];
  const locationList = createLocationLedger(activities);
  return {
    overview: summary,
    stats: statsList,
    activities: activityList, // although everything IS an activity it will get exhaustive once adding in purchases, messaging, meals, ect.
    locations: locationList,
    lastUpdate,  // last update not changed because we are simply reformatting
    date
  };
};



