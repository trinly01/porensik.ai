const assert = require('assert');
const app = require('../../src/app');

describe('\'juan-notifs\' service', () => {
  it('registered the service', () => {
    const service = app.service('juan-notifs');

    assert.ok(service, 'Registered the service');
  });
});
