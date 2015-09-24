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
      if($scope.news.newsDate === undefined||$scope.news.newsDate.length < 1){
        delete $scope.news["newsDate"];
      }
      $http.post('/api/demo/newsarticles', $scope.news).success(function(response) {
        console.log(response);
        refresh();
      });
    };

    $scope.removeNews = function(id) {
      //console.log($scope.news);
      $http.delete('/api/demo/newsarticles/'+id).success(function(response) {
        console.log(response);
        refresh();
      });
    };

    $scope.chart = null;

    $scope.showGraph = function() {
      $scope.chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
          ]
        }
      });
    }
  }
]);




