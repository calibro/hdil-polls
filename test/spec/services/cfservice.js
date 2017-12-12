'use strict';

describe('Service: cfservice', function () {

  // load the service's module
  beforeEach(module('hdilPollsApp'));

  // instantiate service
  var cfservice;
  beforeEach(inject(function (_cfservice_) {
    cfservice = _cfservice_;
  }));

  it('should do something', function () {
    expect(!!cfservice).toBe(true);
  });

});
