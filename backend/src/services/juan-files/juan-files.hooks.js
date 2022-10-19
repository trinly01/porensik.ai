const { authenticate } = require('@feathersjs/authentication').hooks;
const path = require('path')
const search = require(path.join(process.cwd(), 'src', 'pussy-search.js'))

let removeInUploads = async (context) => {
  console.log('context ui', context.result)
  for (var i = 0, len = context.result.length; i < len; i++) {
    let removedUploads = await context.app.service('uploads').remove(null, {
      query: {
        parentNode: context.result[i]._id
      }
    })
    console.log('removedUploads', removedUploads)
  }
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
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
      removeInUploads
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
