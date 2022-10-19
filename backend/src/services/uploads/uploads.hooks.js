const { authenticate } = require('@feathersjs/authentication').hooks;
const fs = require('fs');
const path = require('path')

function upload (hook) {
  if (hook.params.fileName) {
    console.log('dapat makarating dito')
    hook.data = {
      fileName: hook.params.fileName,
      juanData: hook.params.juanData,
      dateUploaded: Date.now()
    }
  }
}

const folder = path.join(__dirname, 'files')

let deleteFile = async (context) => {
  console.log('timi files', context.result)
  for (var i = 0, len = context.result.length; i < len; i++) {
    let filePath = path.join(folder, context.result[i].fileName)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
  
} 

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [ upload ],
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
      deleteFile
    ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      (val) => {
        console.log('trin trin', val)
      }
    ],
    update: [],
    patch: [],
    remove: []
  }
};
