// Initializes the `juan-files` service on path `/juan-files`
const createService = require('feathers-nedb');
const createModel = require('../../models/juan-files.model');
const hooks = require('./juan-files.hooks');

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
  app.use('/juan-files', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('juan-files');

  service.publish(() => app.channel('anonymous', 'authenticated'));
  service.hooks(hooks);
};
