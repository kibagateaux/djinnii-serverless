export const updateDatabaseActivities = async (userId, activities) => {
  const activitiesList = Array.isArray(activities)
    ? activities : Object.keys(activities).map((key) => activities[key]);

  const userActivities = activitiesList.map(act => ({...act, userId, startTime: act.startTime}));
  activityBlobs = userActivities.reduce((blob, next) => {
    // takes activities list and returns blobs of 25 acts or less because Dynamo is a little bitch
    const lastBlob = blob[blob.length - 1];
    const filledBlobs = [...blob].slice(0, (blob.length - 1))
    return (lastBlob.length < 25) ? [...filledBlobs, [...lastBlob, next]] : [...blob, [next]]
  }, [[]]);
  console.log('upd db acts', userActivities, activityBlobs);
  return new Promise((resolve, reject) =>
    resolve(activityBlobs.map(async acts => 
      await post(DYNAMO_TABLES.activities, acts))))
};