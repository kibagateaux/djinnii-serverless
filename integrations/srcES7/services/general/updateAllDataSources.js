// pull tokens from db
// map over top level keys, these are all active integrations
// for each key call associated api lambda e.g. moves = getMovesStorylineData
// each lambda will then send data from there to diffing algo
import AWS from 'aws-sdk';
import {DB} from '../../lib/database';
import axios from 'axios';
import {constructDataAggregatorPipeline} from './diffingAlgorithms';

const lambda = new AWS.Lambda({region: 'us-east-1'}); // FIXME replace with region in context


export const updateAllDataSources = (event, context, callback) => {
  console.log('UPDATE ALL SOURCES');
  const {userId} = event.query;
  if(userId) {
    const queryParams = {
      TableName: process.env.DYNAMODB_META_DATA_TABLE,
      Key: {userId},
      AttributesToGet: ['integrations'],
    };
    DB.get(queryParams, (error, results) => {
      if(!error && results.Item) {
        console.log('aggr results', results);
        const integrations = Object.keys(results.Item)
        const pipeline = constructDataAggregatorPipeline(integrations);
        console.log('pipeline', pipeline);
      } else {
        callback(error, results)
      }
    })
  } else {
    const idError = new Error("Must send userId as path parameter");
    callback(idError, null);
  }
};
