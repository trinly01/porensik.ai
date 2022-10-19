const assert = require('assert');
const app = require('../../src/app');

describe('\'juan-files\' service', () => {
  it('registered the service', () => {
    const service = app.service('juan-files');

    assert.ok(service, 'Registered the service');
  });
});
