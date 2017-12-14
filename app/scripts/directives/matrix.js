'use strict';

/**
 * @ngdoc directive
 * @name hdilPollsApp.directive:matrix
 * @description
 * # matrix
 */
angular.module('hdilPollsApp')
  .directive('matrix', function () {
    return {
      replace: false,
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

        var chart = d3.select(element[0]);

        var chartWidth = element.width(),
            chartHeight = 500;

        var matrix = hdil.matrix()
               .width(chartWidth)
               .height(chartHeight)
               .scale(scope.scaleMatrix)

        chart.datum(scope.matrix).call(matrix)

        scope.$watch('matrix.length',function(newValue,oldValue){
          if(newValue != oldValue){
            chart.datum(scope.matrix).call(matrix.scale(scope.scaleMatrix))
          }
        })

        scope.$watch('updateMatrix',function(newValue,oldValue){
          if(newValue != oldValue){
            chart.datum(scope.matrix).call(matrix.scale(scope.scaleMatrix))
          }
        })
      }
    };
  });
