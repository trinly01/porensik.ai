const juanFolders = require('./juan-folders/juan-folders.service.js');
const juanNotifs = require('./juan-notifs/juan-notifs.service.js');
const users = require('./users/users.service.js');
const uploads = require('./uploads/uploads.service.js');
const juanFiles = require('./juan-files/juan-files.service.js');
const juanForms = require('./juan-forms/juan-forms.service.js');
const juanData = require('./juan-data/juan-data.service.js');
const juanResponses = require('./juan-responses/juan-responses.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(juanFolders);
  app.configure(juanNotifs);
  app.configure(users);
  app.configure(uploads);
  app.configure(juanFiles);
  app.configure(juanForms);
  app.configure(juanData);
  app.configure(juanResponses);
};
