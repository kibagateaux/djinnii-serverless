
// import { movesSvc } from './services/movesSvc';

// import * as services from './services';
// export default services

const services = require('./services');
module.exports = services;
// export default {

// }



// export const helloLambda = (event, context, callback) => {
//   const result = helloSvc({name: 'Serverless'});
//   const response = {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: result,
//       input: event,
//     }),
//   };
//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
//   callback(null, response);
// };
