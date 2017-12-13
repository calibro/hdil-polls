'use strict';

/**
 * @ngdoc service
 * @name hdilPollsApp.apiservice
 * @description
 * # apiservice
 * Factory in the hdilPollsApp.
 */
angular.module('hdilPollsApp')
.factory('apiservice', function ($http, $q) {

  var spreadsheetId = '2PACX-1vScPN9yhHnab1Jdv-sRzW4mPG4_YtUivb7jGfS-T9JzdzA6kdUm7wbJ-fXT-COLBq_6ozPzgtQK0iao';
  var gdriveBaseUrl = 'https://docs.google.com/spreadsheets/d/e/' + spreadsheetId + '/pub';


  return {

    getSpreadsheetData : function(){
      var params = {
        gid:'112972804',
        single:'true',
        output:'tsv'
      }

      var url = gdriveBaseUrl;
      var deferred = $q.defer();

      $http.get(url, {params:params})
        .then(
          function(response){
            deferred.resolve(response.data);
          },
          function(err){
            deferred.reject(err);
          }
        )
      return deferred.promise;
    },
    getSpreadsheetViz : function(){
      var params = {
        gid:'7267316',
        single:'true',
        output:'tsv'
      }

      var url = gdriveBaseUrl;
      var deferred = $q.defer();

      $http.get(url, {params:params})
        .then(
          function(response){
            deferred.resolve(response.data);
          },
          function(err){
            deferred.reject(err);
          }
        )
      return deferred.promise;
    }
  };
});
