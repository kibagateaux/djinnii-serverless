
import AWS from 'aws-sdk';
AWS.config.update({region: 'us-east-1'});

import * as movesService from './movesService';
import * as general from'./general';

export {
  general,
  movesService
};


