// Initializes the `juan-data` service on path `/juan-data`
const createService = require('feathers-nedb');
const createModel = require('../../models/juan-data.model');
const hooks = require('./juan-data.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/juan-data', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('juan-data');

  service.hooks(hooks);
};
