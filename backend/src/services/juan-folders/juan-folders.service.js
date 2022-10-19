// Initializes the `juan-folders` service on path `/juan-folders`
const createService = require('feathers-nedb');
const createModel = require('../../models/juan-folders.model');
const hooks = require('./juan-folders.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    multi: true,
    whitelist: ['$where']
  };

  // Initialize our service with any options it requires
  app.use('/juan-folders', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('juan-folders');

  service.publish(() => app.channel('anonymous', 'authenticated'));
  service.hooks(hooks);
};
