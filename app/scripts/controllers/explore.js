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
      updateCharts()

    }

    $scope.filterBarsReset = function(dimension){
      $scope.currentFilters[dimension] = [];
      cfservice[dimension]().filterAll()
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

    $scope.update = true;
    var updateCharts = function(){
      $scope.update = !$scope.update;
    }

    //get the data

    apiservice.getSpreadsheetViz().then(
      function(data){
        $scope.vizs = d3.tsvParse(data).map(function(d){
          d.url_embed = $sce.trustAsResourceUrl(d.url_embed);
          return d
        });
        $scope.vizSelected = $scope.vizs[0];
        //$scope.tabModel = 'info';
        $scope.tabModel = 'distribution';

        apiservice.getSpreadsheetData().then(
          function(data){
            cfservice.add(d3.tsvParse(data));

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
