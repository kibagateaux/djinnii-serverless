import requireAll from 'require-all';
import _ from 'lodash';

// relation name must be exported at top so it will get picked up
// in self-referencing file read in generateTypeQueries()
export const timeRelationName = "EXISTED_AT"; // whatever term is chosen for this is crucial

/**
 * @name generateTypeQueries
 * @param filter - Maybe add filter fn for requireAll
 * @desc Returns schema queries for accessing all nodes connected to Time
 * @return {String}
 */
const generateTypeQueries = () => {
  const typeDefs = requireAll({
    dirname: __dirname,
    recursive: true
  });
  
  const typeTimeRelations = _.flatMapDeep(typeDefs, (fileExports, fileName) => 
    fileExports.timeRelationName ?
      {name: fileName, relation: fileExports.timeRelationName} : null);
  
  const timeTypeSchemas = typeTimeRelations
    .filter(_.isObject)
    // schema string is one long line because it messes up string formatting which annoys me
    .map((type) => `${type.name.toLowerCase()}s: ${type.name} @relation(name: "${type.relation}", direction: "IN")\n    `);

  return timeTypeSchemas.join('');
};

const timeRelationsQueries = generateTypeQueries();

export default `
  type Time {
    time: Int!
    id: ID @cypher(statement: "WITH {this} AS this RETURN ID(this)")
    activities: [Activity] @relation(name: "ACTED", direction: "OUT")
    user: User @relation(name: "EXISTED_AT", direction: "IN")
  }
`

