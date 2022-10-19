// import '@babel/polyfill'
// import something here
// import VueCodemirror from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
const clippy = require('clipboard-copy')
import xlsx from 'xlsx'
import { saveAs } from 'file-saver'
import viewForm from 'components/viewForm.vue'
import vPrint from 'vue-print-nb'
// var md5 = require('md5')
import md5 from 'md5'
import isImage from 'is-image'
// let isImage = () => true
import isVideo from 'is-video'
import isAudio from 'is-audio'
import { js as beautify } from 'js-beautify'
import $moment from 'moment'
import draggable from 'vuedraggable'
// import CKEditor from '@ckeditor/ckeditor5-vue'
// import $dbCon from '../feathersRealtimeData.js'
let $dbCon = require('../wings-feathers.js').default
import { ceil, transform, isEqual, isObject, reverse, isEmpty, isArray } from 'lodash/fp' // for deepDiff
import { orderBy, filter, uniq, map, round, meanBy, findIndex, cloneDeep } from 'lodash'
const $lodash = { orderBy, filter, uniq, map, round, meanBy, ceil, transform, isEqual, isObject, findIndex, cloneDeep, reverse, isEmpty, isArray, isImage, isVideo, isAudio, md5 }

const _transform = transform.convert({
  cap: false
})

let printElem = require('ink-html')

$lodash.printElem = printElem

const iteratee = baseObj => (result, value, key) => {
  if (!isEqual(value, baseObj[key])) {
    const valIsObj = isObject(value) && isObject(baseObj[key])
    result[key] = valIsObj === true ? deepDiff(value, baseObj[key]) : value
  }
}

function deepDiff (targetObj, baseObj) {
  return _transform(iteratee(baseObj), null, targetObj)
}

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
  $clipboard: '',
  sort: {
    value: 'Name',
    options: ['Name', 'Last modified', 'Date created'],
    desc: true
  },
  clippy,
  listView: false,
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
  Vue.prototype.$Vue = Vue
  // something to do
  // const fileExtension = require('file-extension')
  // import xlsx from 'xlsx'
  // const OCRAD = import("ocradjs-browser.js")
  // const pdfjsLib = require('pdfjs-dist')
  // const mammoth = import("mammoth/mammoth.browser.js")
  // Vue.prototype.$file = {
  //   fileExtension,
  //   xlsx,
  //   OCRAD,
  //   pdfjsLib,
  //   mammoth
  // }

  Vue.prototype.$clipboard = ''

  Vue.prototype.$config = Vue.config

  Vue.prototype.$arrayToCSV = (data, fileName = Date.now() + '.csv') => {
    var XLSX = xlsx
    /* make the worksheet */
    var ws = XLSX.utils.json_to_sheet(data)
    const filenameArray = fileName.split('.')
    var file = null
    if (filenameArray[filenameArray.length - 1] === 'csv') {
      /* write workbook (use type 'binary') */
      file = XLSX.utils.sheet_to_csv(ws)
    } else { // excel
      const wb = XLSX.utils.book_new()
      wb.SheetNames.push('Sheet1')
      wb.Sheets['Sheet1'] = ws
      file = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })
    }

    function s2ab (s) {
      var buf = new ArrayBuffer(s.length)
      var view = new Uint8Array(buf)
      for (var i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
      return buf
    }

    saveAs(new Blob([s2ab(file)], { type: 'application/octet-stream' }), fileName)
    // saveAs(new Blob([s2ab(csv)], { type: 'application/octet-stream' }), fileName)
  }
  Vue.prototype.$xlsx = xlsx
  Vue.use(vPrint)
  // Vue.use(CKEditor)
  Vue.component('draggable', draggable)
  Vue.component('view-form', viewForm)

  app.data = $root
  Vue.prototype.$log = console.log
  Vue.prototype.$timeout = (asd, qwe) => setTimeout(asd, qwe)

  // const host = 'https://e658636c.ap.ngrok.io'
  // const host = 'http://10.10.120.15:3232' // e-IMIS
  const host = 'http://10.10.120.22:3232' // e-Resource
  // const host = 'http://localhost:3232'
  const ssoHost = 'http://10.10.120.32:3536'
  // const ssoHost = 'http://localhost:3536'
  // Vue.prototype.$dbCon = $dbCon(host, {
  //   'juan-folders': {},
  //   'juan-files': { debug: true },
  //   'juan-notifs': {}
  // })
  Vue.prototype.$host = host
  Vue.prototype.$dbCon = $dbCon(host)

  // Vue.prototype.$sso = $dbCon('https://a697bdf2.ap.ngrok.io', {
  //   'users': {}
  // })
  Vue.prototype.$sso = $dbCon(ssoHost, {
    'users': {}
  })
  // Vue.prototype.$sso = $dbCon('http://localhost:3536', {
  //   'users': {}
  // })
  Vue.prototype.$sso.service('users')
  Vue.prototype.$sso.authenticate({
    strategy: 'local',
    email: '2016010@mail.com',
    password: '2016010'
  })

  Vue.prototype.$deepDiff = deepDiff
  Vue.prototype.$moment = $moment
  Vue.prototype.$lodash = $lodash
  Vue.prototype.$beautify = beautify
  // Vue.use(VueCodemirror)

  let filterObject = (obj, keys) => {
    for (let i in obj) {
      if (!obj.hasOwnProperty(i)) continue
      if (keys.includes(i)) {
        delete obj[i]
      } else if (typeof obj[i] === 'object') {
        filterObject(obj[i], keys)
      }
    }
    return obj
  }

  let removePersonalInfo = (obj) => {
    return filterObject(obj, [
      'gender',
      'birthday',
      'birth_place',
      'height',
      'weight',
      'citizenship',
      'blood_type',
      'gsis',
      'pag_ibig',
      'philhealth',
      'sss',
      'cellphone_no',
      'civil_status',
      'permanent_address',
      'permanent_address_telephone_no',
      'permanent_address_zip_code',
      'residential_address',
      'residential_address_telephone_no',
      'residential_address_zip_code',
      'telephone_no',
      'tin',
      'roles',
      'password'
    ])
  }
  Vue.prototype.$filterObject = filterObject
  Vue.prototype.$removePersonalInfo = removePersonalInfo
}
