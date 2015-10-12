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
      
      $http.delete('/api/demo/newsarticles/'+id).success(function(response) {
        console.log(response);
        refresh();
      });
    };

    $scope.chart = null;


    $scope.showGraph = function() {
      $scope.config = {};
      $http.get('/api/demo/quotes_by_date_range?startdate='+$scope.quote.startDate+'&enddate='+$scope.quote.endDate+'&indexsymbol='+$scope.quote.symbol).success(function (response) {
        console.log("I got the quotes I requested ");

        $scope.quotes = response;
        var quoteDates = [];
		quoteDates.push('Dates');
		
		var quotePrices = [];
		quotePrices.push($scope.quote.symbol);

        angular.forEach($scope.quotes, function(quote) {
		   quoteDates.push(new Date(quote.qdate));
		});	

        angular.forEach($scope.quotes, function(quote) {
		   quotePrices.push(quote.close);
		});			



     
      $scope.chart = c3.generate({
        
        data: {

          x: 'Dates',
		  columns: [ 
		         quoteDates,
		         quotePrices
		         
				 
		  ]
          

        },
        axis: {
          x: {
            type: 'timeseries',
            localtime: false,
            tick: {
              format: '%m-%d'
            }
          },
          y: {
            tick: {
              format: d3.format(".2f")

            }
          }
        },
        padding: {
          right: 100
        }
      });
      });

    }
  }
]);




