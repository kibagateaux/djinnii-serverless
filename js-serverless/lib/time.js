'use strict'
const moment = require('moment');
const dayInMicroSecs = 24 * 60 * 60 * 1000; // in microseconds for Unix

module.exports._formatToUnix = dateString => moment(dateString).valueOf()
module.exports._durationUnix = (start, end) => ( _formatToUnix(end) - _formatToUnix(start));

module.exports. _getTimesInUnix = (start, end) => ({
  startTime: _formatToUnix(start),
  endTime:  _formatToUnix(end),
  duration: _durationUnix(start, end)
});

module.exports._sortByTime = (obj) => Object.keys(obj)
  .sort((x, y) => x - y)
  .reduce((a, b) => (isNaN(b) ? a : {...a, [b]: obj[b]}), {});

module.exports._getFirstMSInDay = (timeMS) =>
  // First MS at GMT not local time - add second param localRegion or moment prob has way
  // coerce timeMS to first MS of that day 00:00 and return MS value
  moment(moment(timeMS).format("YYYY-MM-DD 00:00:00.000")).valueOf();

module.exports._getFirstActivityInDay = (time, obj) => {
  const startTime = _getFirstMSInDay(time);
  const endTime = startTime + dayInMicroSecs;
  const sortedActs = _sortByTime(obj);
  const times = Object.keys(sortedActs);
  let firstAct, i = 0;
  // FIXME loop because lazy
  while(!firstAct || i <= times.length) {
    const actTime = times[i];
    if (actTime > startTime && actTime < endTime) {
      firstAct = {[actTime]: obj[actTime]};
      break;
    }
    i++
  }
  return firstAct;
}

module.exports._filterObjByDay = (time, obj) => {
  const startTime = _getFirstMSInDay(time);
  const endTime = startTime + dayInMicroSecs;  
  _filterObjBetweenTimes(startTime, endTime, obj);
};

module.exports._filterObjBetweenTimes = (startTime, endTime, obj) => 
  Object.keys(obj).filter((time) => (time > startTime && time < endTime))
    .reduce((timeline, time) => ({...timeline, [time]: obj[time]}), {});


module.exports._findLastTime = (data) => Object.keys(_sortByTime(data))[0];