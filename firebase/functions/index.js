'use strict';

var functions = require('firebase-functions');
var admin = require('firebase-admin');
var fs = require('fs');
var path = require('path');
var src = require('./src');
admin.initializeApp(functions.config().firebase);

// Folder where all your individual Cloud Functions files are located.
// const FUNCTIONS_FOLDER = './src';
/* needs to be made recursive to go into directories nested in FUNCTIONS_FOLDER, currently only works with fiels as direct children*/
// fs.readdirSync(path.resolve(__dirname, FUNCTIONS_FOLDER)).forEach(file => { // list files in the folder.
//   if(file.endsWith('.js')) {
//     const fileBaseName = file.slice(0, -3); // Remove the '.js' extension
//     if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === fileBaseName) {
//       exports[fileBaseName] = require(`${FUNCTIONS_FOLDER}/${fileBaseName}`);
//     }
//   }
// });

/* Auth Functions */
exports.setMovesApiToken = src.auth.setMovesApiToken(functions, admin);
exports.initMovesOAuth = src.auth.initMovesOAuth(functions, admin);

/* Database Functions */
exports.updateMovesStoryline = src.database.updateMovesStoryline(functions, admin);
exports.getNewStoriesFromMoves = src.database.getNewStoriesFromMoves(functions, admin);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });