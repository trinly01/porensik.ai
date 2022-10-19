// Initializes the `juan-forms` service on path `/juan-forms`
const createService = require('feathers-nedb');
const createModel = require('../../models/juan-forms.model');
const hooks = require('./juan-forms.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/juan-forms', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('juan-forms');

  service.hooks(hooks);
};
