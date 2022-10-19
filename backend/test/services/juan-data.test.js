const assert = require('assert');
const app = require('../../src/app');

describe('\'juan-data\' service', () => {
  it('registered the service', () => {
    const service = app.service('juan-data');

    assert.ok(service, 'Registered the service');
  });
});
