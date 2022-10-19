const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-nedb-fuzzy-search')

let removeInFiles = async (context) => {
  console.log('context folder', context.result)
  for (var i = 0, len = context.result.length; i < len; i++) {
    let removedUploads = await context.app.service('juan-files').remove(null, {
      query: {
        parentFolder: context.result[i]._id
      }
    })
    console.log('removeInFiles', removedUploads)
  }
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [ search({ deep: true }) ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [
      removeInFiles
    ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
