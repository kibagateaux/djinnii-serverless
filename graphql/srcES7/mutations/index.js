import requireAll from 'require-all';
import {
  flatMapDeep,
  trim,
  replace
} from 'lodash';

const mutations = requireAll({
  dirname: __dirname,
  recursive: true
});

const normalizeCypher = (cypher) => 
// for some reason this doesn't remove \n s
  trim(replace(cypher, /\\n/g, ''))
  // trim(replace(cypher, /[\\n]/, ''));

const flattenFiles = (fileExports, fileName) => 
  fileExports.default ? 
    {[fileName]: normalizeCypher(fileExports.default)} :
    flatMapDeep(fileExports, flattenFiles)

const flattenedMutations = flatMapDeep(mutations, flattenFiles)
  .reduce((ms, m) => {
    const name = Object.keys(m)[0];
    return {...ms, [name]: m[name]}}, {});

export default flattenedMutations