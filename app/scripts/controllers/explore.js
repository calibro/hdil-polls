'use strict';

/**
 * @ngdoc function
 * @name hdilPollsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the hdilPollsApp
 */
angular.module('hdilPollsApp')
  .controller('ExploreCtrl', function ($scope,$sce,apiservice,cfservice) {

    $scope.vizs;
    $scope.vizSelected;
    $scope.tabModel;
    $scope.data = [];
    $scope.matrix = [];

    $scope.changeViz = function(viz){
      $scope.vizSelected = viz;

      $scope.filterBarsResetAll()

      cfservice.id().filter($scope.vizSelected.id)


      // reset filters
      $scope.ages = cfservice.ages().all();
      $scope.devices = cfservice.devices().all();
      $scope.sexes = cfservice.sexes().all();

      // update max scales

      var max = Math.max(
        d3.max($scope.ages, function(d){return d.value}),
        d3.max($scope.devices, function(d){return d.value}),
        d3.max($scope.sexes, function(d){return d.value})
      );

      $scope.agesScale = d3.scaleLinear()
        .domain([0,max])
        .range([0,90])

      $scope.devicesScale = d3.scaleLinear()
        .domain([0,max])
        .range([0,90])

      $scope.sexesScale = d3.scaleLinear()
        .domain([0,max])
        .range([0,90])

      $scope.data = [
        { key:'utilità', values: cfservice.utilities().all(), maxY:d3.max(cfservice.utilities().all(), function(d){return d.value})},
        { key:'intuitività', values: cfservice.intuitivenesses().all(), maxY:d3.max(cfservice.intuitivenesses().all(), function(d){return d.value})},
        { key:'chiarezza', values: cfservice.clarities().all(), maxY:d3.max(cfservice.clarities().all(), function(d){return d.value})},
        { key:'informatività', values: cfservice.informativenesses().all(), maxY:d3.max(cfservice.informativenesses().all(), function(d){return d.value})},
        { key:'bellezza', values: cfservice.beauties().all(), maxY:d3.max(cfservice.beauties().all(), function(d){return d.value})},
        { key:'valore complessivo', values: cfservice.overalls().all(), maxY:d3.max(cfservice.overalls().all(), function(d){return d.value})}
      ]

      var matrix = d3.nest()
        .key(function(d){return d[$scope.xAxis.key.toUpperCase()] + '_' + d[$scope.yAxis.key.toUpperCase()]})
        .rollup(function(leaves){return leaves.length})
        .entries(cfservice.cf().allFiltered())

      $scope.matrix = matrix.map(function(d){
        var x = d.key.split('_')[0]?d.key.split('_')[0]:'0',
            y = d.key.split('_')[1]?d.key.split('_')[1]:'0';
        return {x:x, y:y, value: d.value}
      })

      updateMatrix()
      updateCharts()

    }

    $scope.currentFilters = {
      device:[],
      age:[],
      sex:[]
    }

    $scope.labelDict = {
      device:{
        '1':'PC',
        '2':'Smartphone',
        '3':'Tablet',
        '4':'Altro'
      },
      age:{
        '1':'meno di 21 anni',
        '2':'tra 21 e 30 anni compiuti',
        '3':'tra 31 e 45 anni compiuti',
        '4':'tra 46 e 60 anni compiuti',
        '5':'età superiore ai 60 anni'
      },
      sex:{
        '1':'Donne',
        '2':'Uomini'
      }
    }

    $scope.filterBars = function(dimension,key){

      if($scope.currentFilters[dimension].indexOf(key)<0){
        $scope.currentFilters[dimension].push(key)
      }else{
        var index = $scope.currentFilters[dimension].indexOf(key);
        $scope.currentFilters[dimension].splice(index, 1);
      }

      if(!$scope.currentFilters[dimension].length){
        cfservice[dimension]().filterAll()
      }else{
        cfservice[dimension]().filter(function(d){
          return $scope.currentFilters[dimension].indexOf(d) > -1;
        });
      }

      var matrix = d3.nest()
        .key(function(d){return d[$scope.xAxis.key.toUpperCase()] + '_' + d[$scope.yAxis.key.toUpperCase()]})
        .rollup(function(leaves){return leaves.length})
        .entries(cfservice.cf().allFiltered())

      $scope.matrix = matrix.map(function(d){
        var x = d.key.split('_')[0]?d.key.split('_')[0]:'0',
            y = d.key.split('_')[1]?d.key.split('_')[1]:'0';
        return {x:x, y:y, value: d.value}
      })

      updateMatrix()
      updateCharts()

    }

    $scope.filterBarsReset = function(dimension){
      $scope.currentFilters[dimension] = [];
      cfservice[dimension]().filterAll()

      var matrix = d3.nest()
        .key(function(d){return d[$scope.xAxis.key.toUpperCase()] + '_' + d[$scope.yAxis.key.toUpperCase()]})
        .rollup(function(leaves){return leaves.length})
        .entries(cfservice.cf().allFiltered())

      $scope.matrix = matrix.map(function(d){
        var x = d.key.split('_')[0]?d.key.split('_')[0]:'0',
            y = d.key.split('_')[1]?d.key.split('_')[1]:'0';
        return {x:x, y:y, value: d.value}
      })

      updateMatrix()
      updateCharts()
    }

    $scope.filterBarsResetAll = function(dimension){
      Object.keys($scope.currentFilters).forEach(function(d){
        $scope.currentFilters[d] = [];
        cfservice[d]().filterAll()
      })
    }

    $scope.checkBarInactive = function(dimension,key){
      if($scope.currentFilters[dimension].length){
        return $scope.currentFilters[dimension].indexOf(key) == -1;
      }else{
        return false;
      }

    }

    $scope.selectChange = function(){
      var matrix = d3.nest()
        .key(function(d){return d[$scope.xAxis.key.toUpperCase()] + '_' + d[$scope.yAxis.key.toUpperCase()]})
        .rollup(function(leaves){return leaves.length})
        .entries(cfservice.cf().allFiltered())

      $scope.matrix = matrix.map(function(d){
        var x = d.key.split('_')[0]?d.key.split('_')[0]:'0',
            y = d.key.split('_')[1]?d.key.split('_')[1]:'0';
        return {x:x, y:y, value: d.value}
      })
    }

    $scope.update = true;
    var updateCharts = function(){
      $scope.update = !$scope.update;
    }

    $scope.updateMatrix = true;
    var updateMatrix = function(){
      $scope.updateMatrix = !$scope.updateMatrix;
    }

    $scope.$watch('tabModel',function(newValue,oldValue){
      if(newValue != oldValue && oldValue){

        if(newValue == 'distribution'){

        }else if (newValue == 'correlation') {

        }
      }
    })

    //get the data

    apiservice.getSpreadsheetViz().then(
      function(data){
        $scope.vizs = d3.tsvParse(data).map(function(d){
          d.url_embed = $sce.trustAsResourceUrl(d.url_embed);
          return d
        });
        $scope.vizSelected = $scope.vizs[0];
        //$scope.tabModel = 'info';
        $scope.tabModel = 'correlation';

        apiservice.getSpreadsheetData().then(
          function(data){
            cfservice.add(d3.tsvParse(data));

            $scope.scaleMatrix = d3.range(7).map(function(d){
              return d.toString()
            })

            cfservice.id().filter($scope.vizSelected.id)

            // initialise filters
            $scope.ages = cfservice.ages().all();
            $scope.devices = cfservice.devices().all();
            $scope.sexes = cfservice.sexes().all();

            // max scales

            var max = Math.max(
              d3.max($scope.ages, function(d){return d.value}),
              d3.max($scope.devices, function(d){return d.value}),
              d3.max($scope.sexes, function(d){return d.value})
            );

            $scope.agesScale = d3.scaleLinear()
              .domain([0,max])
              .range([0,90])

            $scope.devicesScale = d3.scaleLinear()
              .domain([0,max])
              .range([0,90])

            $scope.sexesScale = d3.scaleLinear()
              .domain([0,max])
              .range([0,90])

            // initialise answers
            $scope.data = [
              { key:'utilità', values: cfservice.utilities().all(), maxY:d3.max(cfservice.utilities().all(), function(d){return d.value})},
              { key:'intuitività', values: cfservice.intuitivenesses().all(), maxY:d3.max(cfservice.intuitivenesses().all(), function(d){return d.value})},
              { key:'chiarezza', values: cfservice.clarities().all(), maxY:d3.max(cfservice.clarities().all(), function(d){return d.value})},
              { key:'informatività', values: cfservice.informativenesses().all(), maxY:d3.max(cfservice.informativenesses().all(), function(d){return d.value})},
              { key:'bellezza', values: cfservice.beauties().all(), maxY:d3.max(cfservice.beauties().all(), function(d){return d.value})},
              { key:'valore complessivo', values: cfservice.overalls().all(), maxY:d3.max(cfservice.overalls().all(), function(d){return d.value})}
            ]

            //dropdown

            $scope.dropdown = [
              { key:'utilità'},
              { key:'intuitività'},
              { key:'chiarezza'},
              { key:'informatività'},
              { key:'bellezza'},
              { key:'valore complessivo'}
            ]

            $scope.xAxis = $scope.dropdown[0];
            $scope.yAxis = $scope.dropdown[1];

            var matrix = d3.nest()
              .key(function(d){return d[$scope.xAxis.key.toUpperCase()] + '_' + d[$scope.yAxis.key.toUpperCase()]})
              .rollup(function(leaves){return leaves.length})
              .entries(cfservice.cf().allFiltered())

            $scope.matrix = matrix.map(function(d){
              var x = d.key.split('_')[0]?d.key.split('_')[0]:'0',
                  y = d.key.split('_')[1]?d.key.split('_')[1]:'0';
              return {x:x, y:y, value: d.value}
            })

          },
          function(error){
            $scope.errors = error
          }
        )
      },
      function(error){
        $scope.errors = error
      }
    )

  });
