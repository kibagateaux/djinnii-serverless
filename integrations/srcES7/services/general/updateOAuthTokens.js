import AWS from 'aws-sdk';
import {DB} from '../../lib/database';

export const updateOAuthTokens = (event, context, callback) => {
  // pull integrationName, tokens, and username from POST body
  // update integrationName where username on tokens.
  const integrationData = event.body ? JSON.parse(event.body) : {};
  const {
    userId,
    accessToken,
    refreshToken,
    integrationName,
  } = integrationData;
  console.log('update tokens integrationData', integrationData);
  if(!userId || !integrationName) {
    const noIdentifiers = new Error("NoIdentifiers UserIdOrIntegrationName")
    callback(noIdentifiers, {})
  } else {
    const getParams = {
      TableName: process.env.DYNAMO_USER_TABLE,
      Key: {userId},
    };
    DB.get(getParams, (error, {Item} = {}) => {
      const userIntegrations = Item.integrations || {};
      const integrationData = userIntegrations[integrationName] || {}
      const putParams = {
        TableName: process.env.DYNAMO_USER_TABLE,
        ReturnValue: "ALL_NEW",
        Item: {
          userId,
          ...Item,
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
      DB.put(putParams, (error, putData) => {
        if(!error) {
          const response = {
            statusCode: 200,
            headers: {
            },
            data: putData
          }
          callback(null, response)
        } else {
          callback(error, putParams)
        }
      })
    })
  }
};