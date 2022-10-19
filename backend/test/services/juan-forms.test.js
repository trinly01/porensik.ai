const assert = require('assert');
const app = require('../../src/app');

describe('\'juan-forms\' service', () => {
  it('registered the service', () => {
    const service = app.service('juan-forms');

    assert.ok(service, 'Registered the service');
  });
});
