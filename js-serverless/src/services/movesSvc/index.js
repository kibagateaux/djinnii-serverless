Object.defineProperty(exports,"__esModule",{value:true});exports.getMovesStorylineData=undefined;var _moves=require('moves');var _moves2=_interopRequireDefault(_moves);var _awsSdk=require('aws-sdk');var _awsSdk2=_interopRequireDefault(_awsSdk);var _movesData=require('../../lib/movesData');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}_awsSdk2.default.config.update({region:"us-east-1"});var dynamoDb=new _awsSdk2.default.DynamoDB.DocumentClient();var getMovesStorylineData=exports.getMovesStorylineData=function getMovesStorylineData(event,context){var userId=event.pathParameters.userId;var queryParams={TableName:process.env.DYNAMODB_TOKENS_TABLE||"djinii-mobilehub-1897344653-Tokens",Key:{userId:"+13472418464"}};dynamoDb.get(queryParams,function(error,results){if(error){console.log('moves storyline fetch user tokens failed',error);context.done(error);}else if(results.Item.moves){var _results$Item$moves=results.Item.moves,access_token=_results$Item$moves.access_token,refresh_token=_results$Item$moves.refresh_token;var moves=new _moves2.default({client_id:process.env.MOVES_API_KEY||"kdiz90L264WQ72Sc7OO0_0IUM4ZRrcB6",access_token:access_token,refresh_token:refresh_token});moves.get('/user/storyline/daily?pastDays=7&trackPoints=true').then(function(response){var normalizeData=(0,_movesData.normalizeStorylineData)(response.data);context.done(null,normalizeData);var newActivities=(0,_movesData.createActivitiesList)(normalizeData);console.log('moves actlist',newActivities);}).catch(function(error){console.log('moves storyline fetch data failed',error);context.done(error);});}else{console.log('get moves tokens null',results);context.done(error);}});};