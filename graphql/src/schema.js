Object.defineProperty(exports,"__esModule",{value:true});var _graphqlTools=require('graphql-tools');var _resolvers=require('./resolvers');var _resolvers2=_interopRequireDefault(_resolvers);var _typeDefinitions=require('./type-definitions');var _typeDefinitions2=_interopRequireDefault(_typeDefinitions);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}console.log('schema',typeof typeDefs);exports.default=(0,_graphqlTools.makeExecutableSchema)({typeDefs:_typeDefinitions2.default,resolvers:_resolvers2.default});