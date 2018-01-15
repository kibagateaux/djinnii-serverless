import {
  integrationNames,
  integrationCategories
} from './integrationConstants';
import {mapValues} from 'lodash';

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
  SOCIAL_MEDIA,
  MESSAGING
} = integrationCategories;

const calculateDataScore = (dataMap = {}) =>
  (evaluatorFunc = calculateDataQuality) => evaluatorFunc(dataMap)

const getAvgDataScore = (dataMap = {}) => {
  const dataPointsCount = Object.keys(dataMap).length;
  const totalScore = Object.keys(dataMap)
    .reduce((total, key) => dataMap[key] + total, 0);
  const avgScore = totalScore / dataPointsCount;
  return avgScore + dataPointsCount; // + dataPoint skews it towards apps that return more data reducing amount of calls needed
};

const calculateDataQuality = (dataMap) =>
  calculateDataScore(dataMap)(getAvgDataScore);
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
    },
    [FACEBOOK]: {
      categories: [
        SOCIAL_MEDIA,
        MESSAGING,
      ]
    }
  },
  [LOCATION_TRACKING]: {
    [FITBIT]: { // GPS is not documented for WebAPI but should be availbale, will see once have Fitbit for testing
      integrationName: FITBIT,
      category: ACTIVITY_TRACKING,
      lambdaName: "",
      requestURL: "/fitbit/activities/{userId}/{logId}",
      valuesReturned: {
        // time: 0? 
        lat: 100,
        lon: 100,
      }
      ,
      get dataQualityScore() {
        return calculateDataQuality(this.valuesReturned);
      }
    },
    [MOVES_APP]: {
      integrationName: MOVES_APP,
      category: ACTIVITY_TRACKING,      
      lambdaName: "",
      requestURL: "/moves/storyline/{userId}",
      valuesReturned: {
        time: 100,
        lat: 100,
        lon: 100,
        placeId: 20,
      },
      get dataQualityScore() {
        return calculateDataQuality(this.valuesReturned);
      }
    },
  },
  [ACTIVITY_TRACKING]: {
    [MOVES_APP]: {
      integrationName: MOVES_APP,
      category: ACTIVITY_TRACKING,      
      lambdaName: "",
      requestURL: "/moves/storyline/{userId}",
      valuesReturned: {
        startTime: 100,
        endTime: 100,
        activity: 100,
        calories: 100,
        lat: 100,
        lon: 100,
        placeId: 20,
        distance: 80,
        get dataQualityScore() {
          return calculateDataQuality(this.valuesReturned);
        }
      }
    },
    [FITBIT]: { // GPS is not documented for WebAPI but should be availbale, will see once have Fitbit for testing
      integrationName: FITBIT,
      category: ACTIVITY_TRACKING,
      lambdaName: "",      
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
      },
      get dataQualityScore() {
        return calculateDataQuality(this.valuesReturned);
      }
    }
  },
  [BIOMETRICS]: {
    [FITBIT]: {
      integrationName: FITBIT,
      category: BIOMETRICS,
      lambdaName: "",      
      requestURL: "",
      valuesReturned: {
        height: 80,
        heightMetric: 100,
        weight: 50,
        weightMetric: 100,
        walkingStrideLength: 75,
        runningStrideLength: 75
      },
      get dataQualityScore() {
        return calculateDataQuality(this.valuesReturned);
      }
    }
  }
};


export default integrationIndex



// Schema

const indexSchema = `
inteface Index {
  list: [IntegrationSummary!]!
}

enum IntegrationList {
  FITBIT,
  FACEBOOK,
  MOVES_APP
}

enum IntegrationCategoryList {
  ACTIVITY_TRACKING,
  LOCATION_TRACKING,
  SLEEP_TRACKING,
  GOAL_TRACKING,
  BIOMETRICS,
  SOCIAL_MEDIA,
  MESSAGING
}

type Integration {
  category: IntegrationCategoryList!
}

type DataItem {
  key: String!
  value: Int! 
}

type IntegrationSummary {
  name: IntegrationList!
  categories: [IntegrationCategoryList!]!
  returnedValues: [DataItem!]!
}

`