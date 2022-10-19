// const { authenticate } = require('@feathersjs/authentication').hooks
const { NotAuthenticated } = require('@feathersjs/errors');

const fs = require('fs');
const mime = require('mime-types')
const util = require('util');
const path = require('path')
// const throttle = require('express-throttle-bandwidth')

const folder = path.join(__dirname, 'files')

var WordExtractor = require("word-extractor");
var extractor = new WordExtractor();

const xlsx = require('xlsx')
const fileExtension = require('file-extension')
const isImage = require('is-image')
const officeParser = require('officeparser');
const { TesseractWorker } = require('tesseract.js');
const worker = new TesseractWorker({
  langPath: path.join(__dirname, 'lang-data'), 
});
const OCRAD = require("ocrad.js")
var Canvas = require('canvas');
var assert = require('assert');

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
    assert(width > 0 && height > 0, 'Invalid canvas size');
    var canvas = Canvas.createCanvas(width, height);
    var context = canvas.getContext('2d');
    return {
      canvas: canvas,
      context: context,
    };
  },

  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');
    assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

const pdfjsLib = require('pdfjs-dist')

if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder)
}
fs.writeFileAsync = util.promisify(fs.writeFile)

module.exports = {
  extractAndSave: function (app, customAuth) {
    return async (req, res, next) => {
      let filesSrvc = app.services['juan-files']
      let service = app.services.uploads
      try {
        let result = {}
        let filePath = ''
        if (req.files) {
          console.log('UPLOADING . . . . . . . . . . . . . . . . .')
          let fileName = `${Date.now()} - ${req.files[0].originalname}`
          let xls = ['csv', 'xls', 'xlsx', 'xlsm']
          let wrd = ['doc', 'docx']
          let ppt = ['ppt', 'pptx']
          let fileExt = fileExtension(fileName)
          let isXLSX = xls.indexOf(fileExt) > -1
          let isOffice = [...wrd, ...ppt].indexOf(fileExt) > -1
          let isPDF = fileExtension(fileExt) === 'pdf'
          let isImg = isImage(fileName)
          
          let filePath = path.join(folder, fileName)
          console.log('filePath', filePath)
          await fs.writeFileAsync(filePath, req.files[0].buffer, 'binary')
          console.log('Uploaded')
          req.feathers.fileName = fileName
          if (isXLSX) {
            var workbook = xlsx.readFile(filePath);
            var sheets = workbook.Sheets
            var records = []
            for(var key in sheets) {
              const data = xlsx.utils.sheet_to_json(sheets[key])
              // records = [...records,...data].map(rec => {
              //   return { ...rec, dataTitle: file.name }
              // })
              records = [...records,...data]
            }
            req.feathers.juanData = records
            next()
          } else if (fileExt === 'doc') {
              console.log('is doc')
              var extracted = extractor.extract(filePath);
              extracted.then(function(doc) {
                let data = doc.pieces.map(p => p.text).join(' ')
                console.log('doc ', data);
                req.feathers.juanData = data
                next()
              });
              // office.parse(filePath, function(err, data) {
              //       console.log(data.sheets);
              // });
          } else if (isOffice) {
            console.log('is Office')
            officeParser.parseOffice(filePath, function(data){
              req.feathers.juanData = data
              next()
            })
          } else if (isPDF) {
            let pdf = await pdfjsLib.getDocument(filePath).promise
            let data = ''
            for(let num = 1; num <= pdf.numPages; num++) {
              let page = await pdf.getPage(num)
              data += (await page.getTextContent()).items.map(s => s.str).join('\n')
              
    
              // var viewport = page.getViewport({ scale: 1.0, });
              // var canvasFactory = new NodeCanvasFactory();
              // var canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
              // var renderContext = {
              //   canvasContext: canvasAndContext.context,
              //   viewport: viewport,
              //   canvasFactory: canvasFactory,
              // };
              // var task = page.render(renderContext)
              // await task.promise
              
              //data += OCRAD(canvasAndContext.canvas)
              // console.log('isPDF')
              // data += (await worker.recognize(canvasAndContext.canvas.toDataURL())).text
              // await (new Promise(function(resolve, reject) {
              //   OCRAD(canvasAndContext.canvas, text => {
              //     console.log('is PDF')
              //     resolve(text);
              //   })
              // }))
            }
            req.feathers.juanData = data
            next()
          } else if (isImg) {
            try {
              req.feathers.juanData = (await worker.recognize(filePath)).text
              worker.terminate();
            } catch (error) {
              let src = fs.readFileSync(filePath)
              let img = new Canvas.Image()
              img.src = src
              
              var canvas = new Canvas.createCanvas(img.width, img.height)
              var ctx = canvas.getContext('2d');
              
              ctx.drawImage(img, 0, 0, img.width, img.height);
              console.log('isIMAGE OCRAD')
              req.feathers.juanData = OCRAD(canvas)
            }
            
            console.log('isIMAGE')
            next()
          } else {
            console.log('undefined po')
            next()
          }
          // next()
        } else {
          next();
        }
      } catch (error) {
        // console.error()
        next(error);
        // throw error
      }
    }
  },
  downloader: function (app, { customId, customAuth }) {
    return async (req, res, next) => {
      let service = app.services.uploads
      try {
        let result = {}
        let filePath = ''
        if (req.query._id) {
          //     auth = authenticate('jwt')
          // auth(req, res, next)
          let _id = req.query._id
          if (customId) _id = await customId(req, res, next)
          console.log(_id)
          if (
            (result = await service.find({query: { _id }})).total && // file exists in database
            fs.existsSync(filePath = path.join(folder, result.data[0].fileName)) // file exists in drive
          ) {
            if (customAuth) await customAuth(req, res, next)
            console.log('file exist')
            res.writeHead(200, { 'Content-Type': mime.lookup(filePath) })
            let input = fs
              .createReadStream(filePath)
            input.pipe(res)
          }
          else {
            next();
          }
        }
        else {
          next();
        }
      } catch (error) {
        // console.error()
        next(error);
        // throw error
      }
    }
  }
}