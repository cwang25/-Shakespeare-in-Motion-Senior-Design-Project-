'use strict';

angular.module('mean.demo').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('demo example page', {
      url: '/demo/example',
      templateUrl: 'demo/views/index.html'
    });
    $stateProvider.state('reports page', {
      url: '/demo/reports',
      templateUrl: 'demo/views/reports.html'
    });
  }
]);
