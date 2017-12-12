'use strict';

/**
 * @ngdoc overview
 * @name hdilPollsApp
 * @description
 * # hdilPollsApp
 *
 * Main module of the application.
 */
angular
  .module('hdilPollsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'angular-loading-bar',
    'rzModule',
    'ui.checkbox',
    'vs-repeat'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/explore', {
        templateUrl: 'views/explore.html',
        controller: 'ExploreCtrl',
        controllerAs: 'explore'
      })
      .otherwise({
        redirectTo: '/home'
      });
  })
  .config(['cfpLoadingBarProvider',function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
