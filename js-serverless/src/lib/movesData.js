Object.defineProperty(exports,"__esModule",{value:true});exports.createDailyLedger=exports.normalizeStorylineData=exports.createActivitiesList=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};var _time=require('./time');function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++){arr2[i]=arr[i];}return arr2;}else{return Array.from(arr);}}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}var normalizeMovesAPILocation=function normalizeMovesAPILocation(place){return place?_extends({id:place.id},place.location,{type:place.type}):null;};var normalizeMovesTrackPoints=function normalizeMovesTrackPoints(trackPoints){return trackPoints?trackPoints.reduce(function(points,_ref){var time=_ref.time,lat=_ref.lat,lon=_ref.lon;var trackTime=(0,_time._formatToUnix)(time);return _extends({},points,_defineProperty({},trackTime,{lat:lat,lon:lon,time:trackTime}));},{}):null;};var createLocationLedger=function createLocationLedger(activities){return activities?Object.keys(activities).reduce(function(ledger,time){var act=activities[time];var locationTimes=act.trackPoints?Object.keys(act.trackPoints):[];var nonDuplicateLocations=locationTimes.filter(function(time){return ledger.indexOf(time)!==-1;});return[].concat(_toConsumableArray(ledger),_toConsumableArray(locationTimes));},[]):[];};var createLocationsList=function createLocationsList(activities){return activities?Object.keys(activities).reduce(function(list,time){var act=activities[time];return act.trackPoints?_extends({},list,act.trackPoints):_extends({},list);},{}):{};};var normalizeMovesActivities=function normalizeMovesActivities(seg){return seg.activities?seg.activities.map(function(act){var actTimes=(0,_time._getTimesInUnix)(act.startTime,act.endTime);var segTimes=(0,_time._getTimesInUnix)(seg.startTime,seg.endTime);var normAct=_extends({},act,actTimes,{trackPoints:normalizeMovesTrackPoints(act.trackPoints),activityGroup:_extends({},segTimes,{type:seg.type,place:normalizeMovesAPILocation(seg.place)})});return normAct;}):[];};var addFillerSpace=function addFillerSpace(activityList){var completeList={};var activityTimes=activityList?Object.keys(activityList):{};activityTimes.reduce(function(last,next){var lastEndTime=activityList[last.time].endTime;var nextStartTime=activityList[next].startTime;var place=activityList[next].activityGroup.place||last.place;lastEndTime!==nextStartTime+1?completeList[lastEndTime+1]={startTime:lastEndTime+1,endTime:nextStartTime-1,duration:nextStartTime-lastEndTime,activity:'idl',place:place,activityGroup:{type:'filler',startTime:lastEndTime+1,endTime:nextStartTime-1}}:null;return{time:next,place:place};},{time:activityTimes[0],place:activityList[activityTimes[0]].place||{}});return completeList;};var createActivitiesList=exports.createActivitiesList=function createActivitiesList(activities){var activityList=activities?activities.reduce(function(ledger,act){return _extends({},ledger,_defineProperty({},act.startTime,act));},{}):{};var fillerActs=addFillerSpace(activityList);var organizedCompleteList=(0,_time._sortByTime)(_extends({},fillerActs,activityList));return organizedCompleteList;};var normalizeStorylineData=exports.normalizeStorylineData=function normalizeStorylineData(stories){return stories?stories.map(function(day){var date=day.date,lastUpdate=day.lastUpdate,summary=day.summary;var normSeg=day.segments.map(function(seg){return normalizeMovesActivities(seg);}).filter(function(seg){return seg.length>0;}).reduce(function(ledger,seg){return[].concat(_toConsumableArray(ledger),_toConsumableArray(seg));},[]);;var unixDate=(0,_time._getFirstMSInDay)((0,_time._formatToUnix)(date));var unixLastUpdate=(0,_time._formatToUnix)(lastUpdate);var activities=createActivitiesList(normSeg);var locations=createLocationsList(activities);var dayWithActivities={date:unixDate,lastUpdate:unixLastUpdate,summary:summary,activities:activities,locations:locations};var fullSummary=createDailyLedger(dayWithActivities);return _extends({},dayWithActivities,{summary:fullSummary});}):[];};var createDailyLedger=exports.createDailyLedger=function createDailyLedger(day){var summary=day.summary,activities=day.activities,lastUpdate=day.lastUpdate,date=day.date,stats=day.stats;var activityList=activities?Object.keys(activities):[];var statsList=stats?Object.keys(stats):[];var locationList=createLocationLedger(activities);return{overview:summary,stats:statsList,activities:activityList,locations:locationList,lastUpdate:lastUpdate,date:date};};