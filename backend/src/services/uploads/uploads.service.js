// Initializes the `uploads` service on path `/uploads`
const { NotAuthenticated } = require('@feathersjs/errors');

const createService = require('feathers-nedb');
const createModel = require('../../models/uploads.model');
const hooks = require('./uploads.hooks');

const { downloader, extractAndSave } = require('./fileExtractor');

const multer = require('multer');
const multipartMiddleware = multer();

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
    multi: true
  };

  // Initialize our service with any options it requires
  // app.use(throttle(1024 * 128))
  app.use('/uploads',
    multipartMiddleware.array('file'),
    downloader(app, {
      customAuth: async (req) => {
        let result = await app.services['juan-files'].find({
          query: {
            'security.public': { $ne: true },
            '_id': req.query._id
          }
        })
        if (result.total) {
          try {
            // console.log(req.headers.authorization)
            await app.passport.verifyJWT(req.headers.authorization || req.query.t, app.get('authentication'))
          } catch (e) {
            throw new NotAuthenticated('No access token');
          }
        }
      },
      customId: async (req) => {
        if (req.query.direct) return req.query._id
        let _id = ''
        const result = await app.services['juan-files'].find({
          query: {
            _id: req.query._id
          }
        })
        // console.log('result.total', result.total)
        if (result.total) {
          node = result.data[0]
          if (node.versions.length === 1 || node.versions[0].approved) {
            _id = node.versions[0]._id
          } else {
            _id = node.versions[1]._id
          }
        }
        // console.log(_id)
        return _id
      }
    }),
    extractAndSave(app),
    createService(options)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');

  service.hooks(hooks);
};
