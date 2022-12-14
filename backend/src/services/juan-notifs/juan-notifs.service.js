// Initializes the `juan-notifs` service on path `/juan-notifs`
const createService = require('feathers-nedb');
const createModel = require('../../models/juan-notifs.model');
const hooks = require('./juan-notifs.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    multi: true
  };

  // Initialize our service with any options it requires
  app.use('/juan-notifs', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('juan-notifs');

  service.publish(() => app.channel('anonymous', 'authenticated'));
  service.hooks(hooks);
};
