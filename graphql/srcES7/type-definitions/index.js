import types from './types';
import interfaces from './interfaces';

console.log('types', [...types, ...interfaces]);

export default [...types, ...interfaces];



// import path from 'path';
// import requireAll from 'require-all';
// import _ from 'lodash'
// const types = requireAll(__dirname);
// const flatTypes = _.flatMapDeep(types, (value, key) => {
//   console.log('flattern', value, key);
//   return _.isEmpty(value) ? null : 
// })
// console.log('type defs', flatTypes);

// export default flatTypes;
