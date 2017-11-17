'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.database = exports.auth = undefined;

var _auth = require('./auth');

var auth = _interopRequireWildcard(_auth);

var _database = require('./database');

var database = _interopRequireWildcard(_database);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.auth = auth;
exports.database = database;