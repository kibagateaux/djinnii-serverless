import {DB} from '../../lib/database';

// connected to SNS topic to receive updates from APIs
// 
export const dataIntegrationsAggregator = (event, context) => {
  console.log('event', event);
  // console.log('context', context);    
}