'use strict';

/* jshint -W098 */
angular.module('mean.demo').controller('DemoController', ['$scope', 'Global', 'Demo', '$http',
  function($scope, Global, Demo, $http) {
    $scope.global = Global;
    $scope.package = {
      name: 'demo'
    };
    var refresh = function() {
      $http.get('/api/demo/newsarticles').success(function (response) {
        console.log("I got the data I requested");
        $scope.newsarticles = response;
        $scope.news = "";

      });

    };
    refresh();

    $scope.addNews = function() {
      console.log($scope.news);
      $http.post('/api/demo/newsarticles', $scope.news).success(function(response) {
        console.log(response);
        refresh();
      });
    };

  }
]);




