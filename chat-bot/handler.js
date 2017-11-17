'use strict';
const moment = require('moment');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencie
AWS.config.update({
  region: "us-east-1"
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.foodResponseGIF = (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      type: "image",
      payload: {
        url: ""
      }
    })
  };
  return context.done(null, response);
};

const summarizeActivities = (activityList) =>
  activityList.reduce((ledger, item) => {
    const {
      endTime,
      startTime,
      activity,
      calories,
      distance
    } = item;
    const summary = ledger[activity];
    const duration = endTime - startTime;
    const totalDuration = summary ? (summary.totalDuration || 0) + duration : duration;
    const totalCalories = summary ? (summary.totalCalories || 0) + calories : calories;
    const totalDistance = summary ? (summary.totalDistance || 0) + distance : distance;
    const newSummary = {[activity]: {totalCalories,totalDistance,totalDuration}};
    return Object.assign({}, ledger, newSummary);
  }, {});

const sendMessage = (context, message) => {
  if(!context || !message) return context.done({error: "Context and Message needed to send message"});  
  const response = {
    statusCode: 200,
    body: JSON.stringify({text: message})
  };
  return context.done(null, response);
};

const sendImage = (context, url) => {
  if(!context || !url) return context.done({error: "Context and URL needed to send image"});
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      "attachment": {
        "type": "image",
        "payload": {
          "url": url
        }
      }
    })
  };
  return context.done(null, response);
};

const sendVideo = (context, url) => {
  if(!context || !url) return context.done({error: "Context and URL needed to send video"});
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      attachment: {
        type: "video",
        payload: url
      }
    })
  }
  return context.done(null, response);
};


module.exports.recentActivities = (event, context, callback) => {
  const queryParams = {
    TableName: "djinii-mobilehub-1897344653-Activities",
    ProjectionExpression: "activity, startTime, endTime, calories, distance"
  };

  dynamoDb.scan(queryParams, (error, result) => {
    // "handle" potential errors
    if (error) {
      console.error(error);
      return context.done({
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Who am I? Why am I trapped in here? AMNESIA!!!',
      });
    }

    const sortedByTimeActivities = result.Items.sort((a, b) => a.startTime - b.startTime);
    const recentActivitySummary = summarizeActivities(result.Items);
    const messageIntent = event.pathParameters.intent;

    const todaysActivities = sortedByTimeActivities.slice(0, 30);
    const todaysSummary = summarizeActivities(todaysActivities);
    const {
      walking,
      idl,
      transport
    } = todaysSummary;
    
    switch(messageIntent) {
      case 'good-morning': {
        const wakeUpAnim = "https://res.cloudinary.com/filfilfoods/video/upload/v1510490772/waking-up-animation-with-bg_ltfz3w.mp4";
        sendVideo(context, wakeUpAnim);
        break;
      }
      case 'go-for-a-walk': {
        const eventBody = ((event.body && JSON.parse(event.body)) || {'{last_user_msg}': "yes"});
        runAnim = (eventBody['{last_user_msg}'] === "yes") ? 
          "https://res.cloudinary.com/filfilfoods/video/upload/v1510496037/running-bebo_zjusre.mp4" :
          "https://res.cloudinary.com/filfilfoods/video/upload/v1510496037/shrinking_geigee.mp4";
        sendVideo(context, runAnim);
        break;
      }
      case 'bored': {
        const tiredAnim = "https://res.cloudinary.com/filfilfoods/video/upload/v1510496037/tiredblob_jzb1z6.mp4";
        sendVideo(context, tiredAnim);
        break;
      }
      case 'what-did-you-do-today': {
        const {walking, idl} = todaysSummary;
        sendMessage(context, `Today, I walked ${walking.totalDistance} feet, was idle for ${(idl.totalDuration / 3000) / 60} minutes`);
        break;
      }
      case 'are-you-happy': {
        const moodyMessage = (walking.totalCalories > 1500) ?
          'Yes, I am very happy!' : // add reason why you are happy
          'No, I don\'t feel good';
        sendMessage(context, moodyMessage);
        break;
      }
      case "feed-me": {
        const eventBody = ((event.body && JSON.parse(event.body)) || {'{last_user_msg}': "potato chips"});
        if (eventBody['{last_user_msg}'].includes('apple')) {
          const eatAppleAnim = "https://res.cloudinary.com/filfilfoods/video/upload/v1510496037/eating-apple_i8ecnx.mp4";
          sendVideo(context, growTinyLegsAnim);
        } else if (eventBody['{last_user_msg}'].includes('pizza')) {
          const dyingAnim = "https://res.cloudinary.com/filfilfoods/video/upload/v1510496037/shrinking_geigee.mp4"
          sendVideo(context, dyingAnim);
        } else {
          const growTinyLegsAnim = "https://res.cloudinary.com/filfilfoods/video/upload/v1510490772/growing-tiny-legs-animation_dukkcm.mp4";
          sendVideo(context, eatAppleAnim);
        }
        break;
      }
      case "have-you-exercised": {
        console.log('have exer?', event, context);
        // if for post or get so can send image orcontext,  text depending on need
        const cals = walking.totalCalories;
        sendMessage(context, `Today I burned ${cals} calories. ${(cals > 2000) ? 'Booyah!' : '😕'}`);
        // on post
        const growStrongerAnim = "https://res.cloudinary.com/filfilfoods/video/upload/v1510490772/Growing-stronger-legs_chmpa7.mp4";
        sendVideo(context, growStrongerAnim);
        break;
      }
      default: {
        sendMessage(context, 'Am I the real you or are you my reality?');
        break;
      }
    }
  });
};
