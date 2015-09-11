'use strict';

/* jshint -W098 */
angular.module('mean.demo').controller('DemoController', ['$scope', 'Global', 'Demo',
  function($scope, Global, Demo) {
    $scope.global = Global;
    $scope.package = {
      name: 'demo'
    };
  }
]);
