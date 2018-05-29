import requireAll from 'require-all';
import {flatMapDeep} from 'lodash';

const typeDefs = requireAll({
  dirname: __dirname,
  recursive: true
});

const flattenFiles = (fileExports) =>
  fileExports.default ?
    [fileExports.default] :
    [flatMapDeep(fileExports, flattenFiles)];

const flattenedTypes = flatMapDeep(typeDefs, flattenFiles);
export default flattenedTypes;

