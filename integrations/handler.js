const services = require("./src/services");
console.log('services', services, services.movesService);
module.exports.movesService = services.movesService;
module.exports.general = services.general;
module.exports.getMovesStorylineData = services.movesService.getMovesStorylineData;