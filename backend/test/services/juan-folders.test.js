const assert = require('assert');
const app = require('../../src/app');

describe('\'juan-folders\' service', () => {
  it('registered the service', () => {
    const service = app.service('juan-folders');

    assert.ok(service, 'Registered the service');
  });
});
