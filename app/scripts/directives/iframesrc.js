'use strict';

/**
 * @ngdoc directive
 * @name hdilPollsApp.directive:iframesize
 * @description
 * # iframesize
 */
angular.module('hdilPollsApp')
  .directive('iframesrc', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.$watch('tabModel', function(newValue,oldValue){
          if(newValue == 'info'){
            element.attr('src',scope.vizSelected.url_embed)
          }else{
            element.attr('src','')
          }
        })

        scope.$watch('vizSelected', function(newValue,oldValue){
          if(newValue && scope.tabModel == 'info'){
            element.attr('src',newValue.url_embed)
          }
        },true)

      }
    };
  });
