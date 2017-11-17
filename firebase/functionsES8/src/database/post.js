export const updateMovesStoryline = (functions, admin) => {
  return functions.https.onRequest((req, res) => {
    const {uid, storylines} = req.body;
    console.log('updated storylines', uid, storylines);
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    admin.database()
      .ref(`users/${req.params.uid}`)
      .update(storylines)
      .then(snapshot => {
        console.log('snapshot', snapshot);
        res.send(snapshot.val());
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        // res.redirect(303, snapshot.ref);
      });
  });
};

export const normalizeMovesStorylineData = (functions,admin) => {
  return functions.https.onRequest((req, res) => {
    const moment = ('moment');
    const {storylines} = req.body;
    
    const normalizedData = (stories) => {
      // should take all day segments and return flat object
      return stories.map((day) => {
        const normSeg = day.segments.map(seg => {
          const {startTime, endTime, type} = seg;
          const segmentTime = _getTimesInUnix(startTime, endTime);
          const activities = normalizeActivities(seg.activities);
          segmentActivity = activities.length > 0 ? activities[0].activity : 'idl';
          const meta = Object.assign({
            type: seg.type, 
            activity: segmentActivity
          }, segmentTime);
          const normData = {meta, activities};
          console.log('normData', normData);
          
          return seg.type === 'place' 
            ? Object.assign({}, normData, seg.place)
            : normData;
        });
        day.segments = normSeg;
        console.log('norm day', day);
        
        return day
      });
    }
  
  })
};

export const normalizeActivities = (functions, admin) => {
  return functions.https.onRequest((req, res) => {
    const {activities} = req.body;
    return activities ? activities.map(act => {
      const time = _getTimesInUnix(act.startTime, act.endTime);
      const normAct = Object.assign({},act,time)
      return normAct;
    }) : [];
  });
};
export const createActivitiesList = (functions, admin) => {
  return functions.https.onRequest((req, res) => {
    const {storylines} = req.body;
    let activityList = {};
    storylines.map((day) => {
      day.segments.map((seg) => {
        seg.activities.map((act) => {
          const startTime = act.startTime
          activityList[startTime] = act;  
        });
      });
    });

    //replace with function api call
    const fillerActs = addFillerSpace(activityList);
    return Object.assign({}, fillerActs, activityList);
    // doesn't need to be organized by time. Expression not reality!
  });
};

export const addFillerSpace = (functions, admin) => {
  return functions.https.onRequest((req, res) => {
    const {data} = req.body
    let completeList = {}
    Object.keys(body).reduce((last, next) => {
      const lastAct = activityList[last]; const nextAct = activityList[next];
      (lastAct.endTime !== nextAct.startTime + 1)
        ? completeList[lastAct.endTime + 1] = {
            startTime: lastAct.endTime + 1,
            endTime: nextAct.startTime - 1,
            duration: nextAct.startTime - lastAct.endTime,
            activity: 'idl',
          } 
        : null
      return next;
    });
    return completeList
  });
};