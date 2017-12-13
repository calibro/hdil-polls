'use strict';

describe('Directive: iframesize', function () {

  // load the directive's module
  beforeEach(module('hdilPollsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<iframesize></iframesize>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the iframesize directive');
  }));
});
