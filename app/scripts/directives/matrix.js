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


       scope.r2 = rSquared(scope.matrix)

        chart.datum(scope.matrix).call(matrix)

        scope.$watch('matrix.length',function(newValue,oldValue){
          if(newValue != oldValue){
            scope.r2 = rSquared(scope.matrix)
            chart.datum(scope.matrix).call(matrix.scale(scope.scaleMatrix))
          }
        })

        scope.$watch('updateMatrix',function(newValue,oldValue){
          if(newValue != oldValue){
            scope.r2 = rSquared(scope.matrix)
            chart.datum(scope.matrix).call(matrix.scale(scope.scaleMatrix))
          }
        })

        function rSquared(values){

          var rSquaredValues = [];
          values.forEach(function(d){
            var range = d3.range(d.value);
            range.forEach(function(e){
              rSquaredValues.push([+d.x,+d.y])
            })
          })

          var regressionLine = ss.linearRegressionLine(ss.linearRegression(rSquaredValues));
          var r2 = ss.rSquared(rSquaredValues, regressionLine);
          return r2;
        }
      }
    };
  });
