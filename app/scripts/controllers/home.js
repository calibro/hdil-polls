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
    $scope.title = "Human Data Interaction in Lombardia: Sviluppo di servizi di visualizzazione interattiva per il pubblico e l’amministratore";
    $scope.description = "Al link sottostante è possibile accedere ad un servizio che permette di visualizzare, per un certo insieme di datasets presenti sul portale Open Data della Regione Lombardia, il loro punteggio di engagement (coinvolgimento), ovvero un indice del livello di interazione di un utente con il portale Open Data di Regione Lombardia. Tale punteggio si può calcolare a livello di singolo dataset, di categoria e di diversa granularità temporale. Per ulteriori informazioni (anche di natura metodologica) è possibile contattare il coordinatore del progetto, il Dott. Ing. Federico Cabitza (cabitza@disco.unimib.it)";
  });
