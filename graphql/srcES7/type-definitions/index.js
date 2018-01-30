import requireAll from 'require-all';
import _ from 'lodash'
const typeDefs = requireAll({
  dirname     :  __dirname,
  recursive   : true
});

const flattenFiles = (fileExports) =>
  fileExports.default ?
    [fileExports.default] :
    [_.flatMapDeep(fileExports, flattenFiles)];

const flattenedTypes = _.flatMapDeep(typeDefs, flattenFiles);
export default flattenedTypes;

