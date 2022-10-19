const nodemailer = require('nodemailer');

var fs = require('fs');
var ejs = require('ejs');
 
var template = fs.readFileSync(__dirname + '/send-mail.html', 'utf8');

let to = ''
let subject = ''
let system = ''
let message = ''
let url = ''

let transporter = nodemailer.createTransport({
  host: '10.10.120.68',
  port: 25,
  // secure: false, // true for 465, false for other ports
  tls:{
    rejectUnauthorized: false
  },
  auth: {
      user: 'ithelpdesk@mirdc.dost.gov.ph', // generated ethereal user
      pass: 'M3t@l23' // generated ethereal password
  }
});

module.exports = function (options = {}) {
  return async function sendMail(req, res, next) {
    console.log('sending mail');
    // req.body.to

    try {
      transporter.sendMail({
        from: '"NO REPLY 👻" <ithelpdesk@mirdc.dost.gov.ph>', // sender address
        to: req.body.to + ', ithelpdesk@mirdc.dost.gov.ph', // list of receivers
        subject: req.body.subject,
        // text: 'Hello world?', // plain text body
        html: req.body.html ? ejs.render(template, req.body.html) : req.body.message
      });

      console.log('success')
    } catch (e) {
      console.log(e)
    }
    
    res.json('success')
  };
};
