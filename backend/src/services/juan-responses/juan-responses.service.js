// Initializes the `juan-responses` service on path `/juan-responses`
const createService = require('feathers-nedb');
const createModel = require('../../models/juan-responses.model');
const hooks = require('./juan-responses.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    whitelist: ['$where']
  };

  // Initialize our service with any options it requires
  app.use('/juan-responses', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('juan-responses');

  service.hooks(hooks);
};
