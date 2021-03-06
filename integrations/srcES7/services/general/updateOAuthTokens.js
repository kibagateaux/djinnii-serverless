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
      DB.put(putParams, (putError, putData) => {
        if(!putError) {
          const response = {
            isBase64Encoded: false,
            statusCode: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Request-Method": "*",
              "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(putData)
          }
          console.log("update tokens success", response)
          callback(null, response);
        } else {
          console.log("update Tokens failed", putError);
          callback(putError);
        }
      })
    })
  }
};