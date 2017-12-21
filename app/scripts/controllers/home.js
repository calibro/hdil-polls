'use strict';

/**
 * @ngdoc function
 * @name hdilPollsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hdilPollsApp
 */
angular.module('hdilPollsApp')
  .controller('HomeCtrl', function ($scope) {
    $scope.title = "Valore sociale della visualizzazione di open data di Regione Lombardia";
    $scope.description = "Al link sottostante è possibile accedere ad un servizio che permette di visualizzare, per un certo insieme di infografiche, la loro qualità percepita, lungo le dimensioni di bellezza, informatività, intuitività e chiarezza, sulla base delle percezioni raccolte in uno studio multi-utente condotto all'interno delle attività di ricerca del progetto \"Il Valore Sociale degli Open Data\" promosso da Regione Lombardia. Per ulteriori informazioni (anche di natura metodologica) è possibile contattare il coordinatore del progetto, il Dott. Ing. Federico Cabitza (cabitza @ disco.unimib.it)";
  });
