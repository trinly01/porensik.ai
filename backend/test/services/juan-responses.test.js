const assert = require('assert');
const app = require('../../src/app');

describe('\'juan-responses\' service', () => {
  it('registered the service', () => {
    const service = app.service('juan-responses');

    assert.ok(service, 'Registered the service');
  });
});
