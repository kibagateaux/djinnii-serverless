import integrationIndex from '../../lib/integrationsIndex';
import {integrationNames} from '../../lib/integrationConstants';
import {mapValues, filter, flatten} from 'lodash';
import integrationsIndex from '../../lib/integrationsIndex';

const {FITBIT, MOVES_APP,FACEBOOK} = integrationNames;

/**
 * @name sortIntegrationsByCategory
 * @desc Takes array of integration names and builds sorted object of all categories they fit into
 * @param {Object} index - index of integration categories, values, API calls, and other metadata
 * @param {Array} integrations - Array of available integrations for a user
 * @returns {Object} - returns integrations sorted into categories of data they provide specified in index
*/
const sortIntegrationsByCategory = (integrations) => (
  integrations.reduce((categories, intgName) => { // abstract this function out because it is super useful
    const intg = integrationIndex.integrationsList[intgName];
    return (intg ? intg.categories : []).reduce((map, cat) =>
    // combines final object with each integration update for a category
      ({...map, [cat]: [...(map[cat] || {}), intgName]}), categories);
  }, {})
);

/**
 * @name sortIntegrationsByDataQuality
 * @desc Takes array of all user enabled integrations and adds a fitnes for each integration by category
 * @param {Object} index - index of integration categories, values, API calls, and other metadata
 * @param {Array} integrations - Array of available integrations for a user
 * @returns {Object} - returns categories with array of integrations and their associated data quality score
*/
const sortIntegrationsByDataQuality = (categoryMap) => {
  const fittedIntegrationsList = mapValues(categoryMap, (intgs, cat) => (
    intgs ? intgs.reduce((fitnessScores, intg) => {
      const fitness = (integrationIndex[cat] || {})[intg] ?
        integrationIndex[cat][intg].dataQualityScore : 0
      return [...fitnessScores, [intg, fitness]];
    }, {}) : {}), {});
  return fittedIntegrationsList;
};

/**
 * 
 * @param {Object} index 
 * @param {Object} categoryIntegrations - {[category]: {[intg]: weight, [intg]: weight}}
 * 
 * @desc Does this whole data requirement per call even make sense?
 * Why would you select only certain data from an API?
 * Only makes sense if data sources vary widly with what they provide even within same category
 * For instance Fitbit returns heartrate during an activity where Moves does not.
 * Is it better to do post aggregation diffing to make sure there is no confusion between data sources?
 * Perks of time based model is that time should be same regardless, excusing margin of errors ofc
 * 
 * 
 * Time is a necessity though, if we can't get time coupled with the data then the data is useless
 * 
 */
export const fillCategoryDataDependencies = (category = "") =>
  (availableIntegrations = []) => (integrationCalls = []) => {
    // I broke this woops
    const dataRequirements = integrationIndex.categoryDependencies[category];

    const fulfilledRequirements = integrationCalls
      .reduce((list, intg) => (intg.length > 0 ?
        [...list, ...intg[1]] : [...list]), []);
    if ((dataRequirements.length === fulfilledRequirements.length)
        || availableIntegrations.length === 0) {
      return integrationCalls
    } else {
      const fitnessSortedIntg = availableIntegrations
        .sort((intg1, intg2) => intg2[1] - intg1[1]);
      const [primeIntgName, primeIntgFitness] = fitnessSortedIntg[0];
      const intgIndex = integrationIndex[category][primeIntgName] || {};
      const remainingRequirements = dataRequirements
        .filter((req) => !fulfilledRequirements.includes(req));
      const intgDataRequirments = filter(remainingRequirements,
        (req) => Object.keys(intgIndex.valuesReturned).includes(req));

      const remainingIntegrations = availableIntegrations.slice(1);
      const integrationFulfillment = [intgIndex.requestURL, intgDataRequirments];
      return ( 
        fillCategoryDataDependencies(category)
          (remainingIntegrations)
          ([...integrationCalls, integrationFulfillment])
      );
      // make into actual tail call recursion, should only require minor refactoring
      // return [...integrationCalls, fillCategoryDataDependencies(category)(remainingIntegrations)]
  }
}

/**
 * @name constructDataAggregatorPipeline
 * @desc Builds an array of all the api calls needed to aggregate all of a user's integrated data
 * @param {Object} index - index of integration categories, values, API calls, and other metadata 
 * @param {Object} integrationsList - Categories with fitness scored integrations {[category]: [[intg, fitness], [intg, fitness]]}
 * @returns {Object} - returns categories with array of integration calls that satisfy data requirements
*/
export const constructDataAggregatorPipeline = (integrationsList) => {
  const categoryMap = sortIntegrationsByCategory(integrationsList);
  const fittedIntegrationsList = sortIntegrationsByDataQuality(categoryMap);
  const dataCalls = mapValues(fittedIntegrationsList, (fitnessScores, category) => {
    return fillCategoryDataDependencies(category)
      (fittedIntegrationsList[category])([])
  });

  const pipeline = Object.keys(dataCalls)
    .reduce((list, category) => [...list, ...dataCalls[category]], [])
    .filter((call) => call[1].length > 0) // removes calls that dont' request data

    console.log('data aggregator pipeline', pipeline);
  return pipeline;
};

constructDataAggregatorPipeline([FITBIT, MOVES_APP]);