export const sortIntegrationsHOF = (sortingFunc) => (sortingIndex) =>
  (integrations) => sortingFunc(sortingIndex)(integrations);

export const sortIntegrationsByDataRelevance = (index) => (integrations) => {
  // map over integrations array
  // get categories for each intg.
  // reduce to list of cat. with complementary intg.
  // for each intg. in cat. calculate relevance score (avg of quality * total returned values) & get returned values for each intg.
  // find missing required values in top relevant intg. and recur find in subsequent intg till all values satisfied.
  // reduce into single array of obj with Lambda call + normalized values needed from intg.
}