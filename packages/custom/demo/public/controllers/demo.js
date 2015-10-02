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
      $http.get('/api/demo/quotes_by_date_range?startdate=2015-09-21&enddate=2015-09-30').success(function (response) {
        console.log("I got the quotes I requested");
        $scope.quotes = response;



      $scope.chart = c3.generate({

        data: {


          columns: [

            ['BCOM', $scope.quotes[0].close, $scope.quotes[1].close, $scope.quotes[2].close, $scope.quotes[3].close, $scope.quotes[4].close]
          ]

        }
      });
      });
    }
  }
]);




