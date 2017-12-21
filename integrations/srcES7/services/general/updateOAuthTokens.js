import AWS from 'aws-sdk';
import {DB} from '../../lib/database';

export const updateOAuthTokens = (event, context, callback) => {
  // pull from event.body if POST request else event itself if invoked
  const integrationData = event.body ? event.body : event;
  const {
    userId,
    accessToken,
    refreshToken,
    integrationName,
  } = integrationData;
  if(!userId || !integrationName) {
    const noIdentifiers = new Error("NoIdentifiers UserIdOrIntegrationName")
    callback(noIdentifiers, {})
  } else {
    const getParams = {
      TableName: process.env.DYNAMO_USER_TABLE,
      Key: {userId}
    };
    DB.get(getParams, (getError, getData = {}) => {
      console.log('get user metdata', getData, getError);
      const userIntegrations = getData.Item ? getData.Item.integrations : {};
      const integrationData = userIntegrations[integrationName] || {}
      const putParams = {
        TableName: process.env.DYNAMO_USER_TABLE,
        ReturnValue: "ALL_NEW",
        Item: {
          userId,
          ...getData.Item,
          integrations: {
            ...userIntegrations,
            [integrationName]: {
              ...integrationData,
              accessToken,
              refreshToken,
            }
          }
        }
      };
      console.log('putData params', putParams.Item);
      DB.put(putParams, (putError, putData) => {
        if(!putError) {
          const response = {
            statusCode: 200,
            headers: {
            },
            data: putData
          }
          console.log("update tokens success", response)
          callback(null, response);
        } else {
          console.log("update Tokens failed", putError);
          callback(putError, putParams);
        }
      })
    })
  }
};