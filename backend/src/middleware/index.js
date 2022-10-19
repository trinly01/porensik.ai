const test = require('./test');
const suggestspell = require('./suggestspell');
const opendata = require('./opendata');
const sendMail = require('./send-mail');
// const cli = require('./cli');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.use('/test', test(app));
  app.use('/suggestspell', suggestspell(app));
  app.use('/opendata', opendata(app));
  app.use('/sendMail', sendMail());
};
