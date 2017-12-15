'use strict';

/**
 * @ngdoc directive
 * @name hdilPollsApp.directive:violinplot
 * @description
 * # violinplot
 */
angular.module('hdilPollsApp')
  .directive('violinplot', function () {
    return {
      replace: false,
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var chart = d3.select(element[0]);

        var chartWidth = element.width(),
            chartHeight = 575;

        var violin = hdil.violin()
               .width(chartWidth)
               .height(chartHeight)

        chart.datum(scope.data).call(violin)

        scope.$watch('data.length',function(newValue,oldValue){
          if(newValue != oldValue){
            chart.datum(scope.data).call(violin)
          }
        })

        scope.$watch('update',function(newValue,oldValue){
          if(newValue != oldValue){
            chart.datum(scope.data).call(violin)
          }
        })

      }
    };
  });
