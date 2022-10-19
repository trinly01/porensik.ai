const { authenticate } = require('@feathersjs/authentication').hooks;
const search = require('feathers-nedb-puzzy-search')

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ search({deep: true}) ],
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
    remove: []
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
