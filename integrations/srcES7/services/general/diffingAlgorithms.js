import integrationIndex from '../../lib/integrationsIndex';
import {integrationNames} from '../../lib/integrationConstants';
import {mapKeys} from 'lodash';

const {FITBIT, MOVES_APP,FACEBOOK} = integrationNames;

export const sortIntegrationsHOF = (sortingFunc) => (sortingIndex) =>
  (integrations) => sortingFunc(sortingIndex)(integrations);

export const sortIntegrationsByCategory = (index) => (integrations) =>
  integrations.reduce((categories, intgName) => { // abstract this function out because it is super useful
    const intg = index.list[intgName];
    return (intg ? intg.categories : []).reduce((map, cat) =>
    // combines total object with each integration update for a category
      ({...map, [cat]: [...(map[cat] || {}), intgName]}), categories);
  }, {});

export const sortIntegrationsByDataQuality = (index) => (integrations) => {
  // X map over integrations array 
  // X get categories for each intg.
  // X reduce to list of cat. with complementary intg.
  // for each intg. in cat. calculate Quality score (avg of quality * total returned values) & get returned values for each intg.
  // find missing required values in top relevant intg. and recur find in subsequent intg till all values satisfied.
  // reduce into single array of obj with Lambda call + normalized values needed from intg.
  
  const categoryMap = sortIntegrationsByCategory(index)(integrations)
  // const integrationsSortedByDataQuality = mapKeys(categoryMap, (intgs, category) => {
  //   console.log('srt by data', category, index[category]);
  //   const integrationScores = intgs.map((intg) => {
  //     const isIntegration = index[category] ? Boolean(index[category][intg]) : false;
  //     console.log('intg', intg, );
  //     const dataQualityScore = isIntegration ?
  //       index[category][intg].dataQualityScore : 0;
  //       // console.log('intg scroe', intg, dataQualityScore);
  //     return dataQualityScore;
  //   });
  //   console.log('map cat', integrationScores);
  // })
}

const catSort = sortIntegrationsByCategory(integrationIndex)([FITBIT, MOVES_APP]);
console.log('cat sort', catSort);
sortIntegrationsHOF(sortIntegrationsByDataQuality)(integrationIndex)([FITBIT, MOVES_APP])