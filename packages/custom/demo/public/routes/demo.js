'use strict';

angular.module('mean.demo').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('Rest API document', {
      url: '/demo/rest_api_document',
      templateUrl: 'demo/views/rest_api_document.html'
    });
    $stateProvider.state('Reports Page', {
      url: '/demo/reports',
      templateUrl: 'demo/views/reports.html'
    });

  }
]);

