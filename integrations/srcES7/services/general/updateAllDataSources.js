// pull tokens from db
// map over top level keys, these are all active integrations
// for each key call associated api lambda e.g. moves = getMovesStorylineData
// each lambda will then send data from there to diffing algo
import AWS from 'aws-sdk';
import {DB} from '../../lib/database';
import axios from 'axios';

export const updateAllDataSources = (event, context, callback) => {
  const {userId} = event.pathParameters;
  if(userId) {
    const queryParams = {
      TableName: process.env.DYNAMODB_TOKENS_TABLE,
      Key: {userId}
    };
    const dataIntegrationServices = {
      // these should be dynamic based on context of region, dev stage, and API gateway used
      moves: {
        FunctionName: "jinni-integrations-dev-getMovesStorylineData",
        options : {
          "resource": "/",
          "path": `/${userId}`,
          "httpMethod": "GET",
        }
      },
      // other integrations here
    }
    DB.get(queryParams, (error, results) => {
      if(!error && results.Item) {
        const integrations = Object.keys(results.Item)
        .filter((key) => key !== 'userId') //  filters out userId, the only non token value in DB
        const fetchingFunctionsForAvailableIntegrations = integrations
          .map((integration) => datafetchingFunctions[integration])
          .filter((func) => !!func) // filters only functions available, should be some kind of pattern checking for properly formatted region etc.
        const fetchingPromises = fetchingFunctionsForAvailableIntegrations.map((func) => 
          new Promise((reject, resolve) => {
            const lambda = new AWS.Lambda({region: 'us-east-1'}); // FIXME replace with region in context
            console.log('fetch data func', func);
            axios.get(func).then(resolve).catch(reject)
          }))
          
        Promise.all(fetchingPromises)
          .then((huh) => {
            console.log('promises', huh);
            // filter calls that failed and retry based on error message
            context.done(null, {})
          })
          .catch((huh) => {
            console.log('promise fail', huh);
            context.done(huh, {});
          })
      } else {
        context.done(error, results)
      }
    })
  } else {
    context.done({statusCode: 200, error: "Must send userId as path parameter"})
  }
};
