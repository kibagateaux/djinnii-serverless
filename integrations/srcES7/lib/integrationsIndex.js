import {
  integrationNames,
  integrationCategories
} from './integrationConstants';

const {
  MOVES_APP,
  FACEBOOK,
  FITBIT
} = integrationNames;

const {
  ACTIVITY_TRACKING,
  LOCATION_TRACKING,
  SLEEP_TRACKING,
  GOAL_TRACKING,
  BIOMETRICS,

} = integrationCategories;

// can probably turn this into standardized schema like GQL

const integrationIndex = {
  list: {
    [FITBIT]: {
      categories: [
        ACTIVITY_TRACKING, 
        SLEEP_TRACKING,
        GOAL_TRACKING,
        LOCATION_TRACKING,
        BIOMETRICS
      ],
    },
    [MOVES_APP]: {
      categories: [
        ACTIVITY_TRACKING, 
        LOCATION_TRACKING,
      ]
    }
  },
  LOCATION_TRACKING: [
    { // GPS is not documented for WebAPI but should be availbale, will see once have Fitbit for testing
      integrationName: FITBIT,
      category: ACTIVITY_TRACKING,
      requestURL: "/fitbit/activities/{userId}/{logId}",
      valuesReturned: {
        // time: 0? 
        lat: 100,
        lon: 100,
      }
    },
    {
      integrationName: MOVES_APP,
      requestURL: "/moves/storyline/{userId}",
      category: ACTIVITY_TRACKING,      
      valuesReturned: {
        time: 100,
        lat: 100,
        lon: 100,
        placeId: 20,
      }
    },
  ],
  ACTIVITY_TRACKING: [
    {
      integrationName: MOVES_APP,
      requestURL: "/moves/storyline/{userId}",
      category: ACTIVITY_TRACKING,      
      valuesReturned: {
        startTime: 100,
        endTime: 100,
        activity: 100,
        calories: 100,
        lat: 100,
        lon: 100,
        placeId: 20,
        distance: 80
      }
    },
    { // GPS is not documented for WebAPI but should be availbale, will see once have Fitbit for testing
      integrationName: FITBIT,
      category: ACTIVITY_TRACKING,
      requestURL: "/fitbit/activities/{userId}",
      valuesReturned: {
        startTime: 100,
        duration: 100,
        heartRate: 100,
        activity: 100,
        source: 100,
        calories: 100,
        distance: 80,
        integrationItemID: 100, // can use to retrieve more data from fitbit API e.g. GPS data during activity
        // technically these are a second API call but they fall under activity tracking
        lat: 100,
        lon: 100,
      }
    }
  ],
  BIOMETRICS: [
    {
      integrationName: FITBIT,
      category: BIOMETRICS,
      requestURL: "",
      valuesReturned: {
        height: 80,
        heightMetric: 100,
        weight: 50,
        weightMetric: 100,
        walkingStrideLength: 75,
        runningStrideLength: 75
      }
    }
  ]
};


export default integrationIndex