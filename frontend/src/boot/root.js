// var md5 = require('md5')
import isImage from 'is-image'
// let isImage = () => true
import isVideo from 'is-video'
import isAudio from 'is-audio'
import { ceil, transform, isEqual, isObject, reverse, isEmpty, isArray } from 'lodash/fp' // for deepDiff
import { round, meanBy, findIndex, cloneDeep } from 'lodash'
const $lodash = { round, meanBy, ceil, transform, isEqual, isObject, findIndex, cloneDeep, reverse, isEmpty, isArray, isImage, isVideo, isAudio, md5 }

const nodeFormat = {
  _id: 'My Drive',
  label: 'My Drive',
  parentFolder: 'My Drive',
  userId: '',
  security: {
    public: false,
    viewers: [],
    uploaders: [],
    modifiers: [],
    removers: [],
    folderCreators: [],
    approvers: []
  },
  isFolder: true,
  fileVersions: [],
  logs: [],
  extras: {}
}

const fileFormat = cloneDeep(nodeFormat)
fileFormat.isFolder = false

const formFormat = cloneDeep(nodeFormat)
formFormat.isFolder = false
formFormat.type = 'form'
formFormat.label = ''
formFormat.details = ''
const formElem = {
  type: 'text',
  value: '',
  isRequired: false
}
formFormat.format = [cloneDeep(formElem)]

// root data
const $root = {
  jwt: '',
  global: {},
  user: false,
  folders: [],
  files: [],
  notifs: [],
  newNotifs: 0,
  currentFolder: nodeFormat,
  clickedItem: nodeFormat,
  nodeFormat,
  fileFormat,
  formFormat,
  path: [nodeFormat]
}

// leave the export, even if you don't use it
export default async ({ app, router, Vue }) => {
  app.data = $root
  Vue.prototype.$lodash = $lodash
  Vue.prototype.$beautify = () => {}
}
