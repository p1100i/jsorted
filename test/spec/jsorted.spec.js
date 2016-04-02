var
  requireHelper = require('../require-helper'),
  fn            = requireHelper('./jsorted');

describe('fn', function () {
  it('should return 1', function () {
    expect(fn()).toEqual(1);
  });
});
