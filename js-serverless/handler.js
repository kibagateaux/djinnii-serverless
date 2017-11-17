'use strict';


const services = require('./services/services');
console.log('services', services);
console.log(services.movesService.getMovesStorylineData, typeof services.movesService.getMovesStorylineData );
module.exports = services;

// module.exports.hello = (event, context, callback) => {
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: 'Go Serverless v1.0! Your function executed successfully!',
//       input: event,
//     }),
//   };

//   callback(null, response);

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
// };
