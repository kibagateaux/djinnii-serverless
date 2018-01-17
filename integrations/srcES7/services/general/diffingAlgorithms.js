import integrationIndex from '../../lib/integrationsIndex';
import {integrationNames} from '../../lib/integrationConstants';
import {mapValues, filter} from 'lodash';

const {FITBIT, MOVES_APP,FACEBOOK} = integrationNames;

/**
 * @name sortIntegrationsByCategory
 * @param {Object} index - index of integration categories, values, API calls, and other metadata
 * @param {Array} integrations - Array of available integrations for a user
 * @returns {Object} - returns integrations sorted into categories of data they provide specified in index
*/
export const sortIntegrationsByCategory = (integrations) => (
// Takes array of integration names and builds sorted object of all categorie they fit into
  integrations.reduce((categories, intgName) => { // abstract this function out because it is super useful
    const intg = integrationIndex.integrationsList[intgName];
    return (intg ? intg.categories : []).reduce((map, cat) =>
    // combines final object with each integration update for a category
      ({...map, [cat]: [...(map[cat] || {}), intgName]}), categories);
  }, {})
);

/**
 * @name sortIntegrationsByDataQuality
 * @desc Takes array of all user enabled integrations and adds a weight for each integration by category
 * @param {Object} index - index of integration categories, values, API calls, and other metadata
 * @param {Array} integrations - Array of available integrations for a user
 * @returns {Object} - returns categories with array of integrations and their associated data quality score
*/
export const sortIntegrationsByDataQuality = (integrations) => {
  const categoryMap = sortIntegrationsByCategory(integrations);
  const weightedIntegrationsMap = mapValues(categoryMap, (intgs, cat) => (
    intgs ? intgs.reduce((weights, intg) => {
      const weight = (integrationIndex[cat] || {})[intg] ?
        integrationIndex[cat][intg].dataQualityScore : 0
      return [...weights, [intg, weight]];
    }, {}) : {}), {});
    constructDataAggregatorPipeline(weightedIntegrationsMap)
  return weightedIntegrationsMap;
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
const fillCategoryDataDependencies = (category = "") =>
// recursively builds list of API calls needed for a category
  (integrationWeights = []) => (integrationCalls = []) => {

    // check dependecies for category, fulfilDep = fulfil.reduce(l,i => [...l, ...i[1]])
    // if fulfilled length = dependencies then return
    // else sort integrations by weight
    // take first integration and map over remaining dependecies
    // make array with API call + dependencies intg has
    // return [...integrationCalls, [API call, requirements], fillCategoryDependecies()]
    const dataRequirements = integrationIndex.categoryDependencies[category]; 
    console.log('categry', category);
    if(!dataRequirements) throw new Error("IntegrationIndex Error: Category dependencies do not exist");
    console.log('intg we', integrationWeights);
    const fulfilledRequirements = integrationCalls
      .reduce((list, intg) => (intg.length > 0 ?
        [...list, ...intg[1]] : [...list]), []);

    console.log('fill data req', category);
    if ((dataRequirements.length === fulfilledRequirements.length)
        || integrationWeights.length === 0) {
      return integrationCalls
    } else {
      const weightSortedIntg = integrationWeights
        .sort((intg1, intg2) => intg2[1] - intg1[1]);
      const [primeIntgName, primeIntgWeight] = weightSortedIntg[0];
      const intgIndex = integrationIndex[category][primeIntgName] || {};
      const remainingRequirements = dataRequirements
        .filter((req) => !fulfilledRequirements.includes(req));
      const intgDataRequirments = filter(remainingRequirements,
        (req) => Object.keys(intgIndex.valuesReturned).includes(req));

      console.log('weight sorted intg',remainingRequirements, intgDataRequirments);
      const remainingIntegrations = integrationWeights.slice(1);
      const integrationFulfillment = [intgIndex.requestURL, intgDataRequirments];
      console.log('integration fulfilment', integrationFulfillment);
      return ( // make actual tail call recursion to fill array with [...inegrationCalls, fillCategoryDependencies]
        fillCategoryDataDependencies(category)
          (remainingIntegrations)
          ([...integrationCalls, integrationFulfillment])
      );
    console.log('fulful req', dataRequirements, formatedIntg, weightSortedIntg);

  
    return 
  }
}

/**
 * @name constructDataAggregatorPipeline
 * @param {Object} index - index of integration categories, values, API calls, and other metadata 
 * @param {Object} integrationsList - Categories with weighted integrations + returned values
 * @returns {Object} - returns categories with array of integration calls that satisfy data requirements
*/
export const constructDataAggregatorPipeline = (integrationsList) => {
  // builds list of API calls per category
  console.log('const pip', integrationsList);
  const dataCalls = mapValues(integrationsList, (weights, category) => {
    const categoryCalls = fillCategoryDataDependencies(category)
      (integrationsList[category])
      ([]);
    console.log('cat calls', categoryCalls);
    return categoryCalls;
  })
  console.log('data calls', dataCalls);

  // reduce into single array of [Lambda call, dataReq];

};

sortIntegrationsByDataQuality([FITBIT, MOVES_APP])