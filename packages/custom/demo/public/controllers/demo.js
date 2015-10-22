'use strict';

/* jshint -W098 */
angular.module('mean.demo').controller('DemoController', ['$scope', 'Global', 'Demo', '$http',
  function($scope, Global, Demo, $http) {
    $scope.global = Global;
    $scope.package = {
      name: 'demo'
    };
    var refresh = function () {
      $http.get('/api/demo/newsarticles').success(function (response) {
        console.log("I got the data I requested");
        $scope.newsarticles = response;
        $scope.news = "";


      });

    };
    refresh();

    $scope.addNews = function () {
      console.log($scope.news);
      if ($scope.news.newsDate === undefined || $scope.news.newsDate.length < 1) {
        delete $scope.news["newsDate"];
      }
      $http.post('/api/demo/newsarticles', $scope.news).success(function (response) {
        console.log(response);
        refresh();
      });
    };

    $scope.removeNews = function (id) {

      $http.delete('/api/demo/newsarticles/' + id).success(function (response) {
        console.log(response);
        refresh();
      });
    };

    $scope.chart = null;


    $scope.showGraph = function () {
        //d3.select(".body").selectAll("svg").remove();
      $http.get('/api/demo/quotes_by_date_range?startdate=' + $scope.quote.startDate + '&enddate=' + $scope.quote.endDate + '&indexsymbol=' + $scope.quote.symbol).success(function (response) {
        console.log("I got the quotes I requested ");

        $scope.quotes = response;
        var width = 900;
        var height = 500;
        String.prototype.format = function () {
          var formatted = this;
          for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
          }
          return formatted;
        };
        var dateFormat = d3.time.format("%m-%d");
        var end = new Date();
        var start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 60);
        var data = [];

        function min(a, b) {
          return a < b ? a : b;
        }

        function max(a, b) {
          return a > b ? a : b;
        }
        appendToData();

        function buildChart(data) {
            d3.select("svg").remove();
          var margin = 50;
          var padding = 100;

          var chart = d3.select("#chart")
              .insert("svg:svg")
              .attr("class", "chart")
              .attr("width", width)
              .attr("height", height);
          var y = d3.scale.linear()
              .domain([d3.min(data.map(function (x) {
                return x["low"];
              })), d3.max(data.map(function (x) {
                return x["high"];
              }))])
              .range([height - margin, margin]);

          var x = d3.time.scale()
              .domain([new Date(data[data.length - 1].qdate), new Date(data[0].qdate)])

              //.range([margin, width - margin]);
              //.range([padding, width - padding * 2]);
              .range([padding, width - padding * 2]).nice(data.length);
          chart.selectAll("line.x")
              .data(x.ticks(5))
              .enter().append("svg:line")
              .attr("class", "x")
              .attr("x1", x)
              .attr("x2", x)
              .attr("y1", margin)
              .attr("y2", height - margin)
              .attr("stroke", "#ccc");
          chart.selectAll("line.y")
              .data(y.ticks(10))
              .enter().append("svg:line")
              .attr("class", "y")
              .attr("x1", margin)
              .attr("x2", width - margin)
              .attr("y1", y)
              .attr("y2", y)
              .attr("stroke", "#ccc");
          chart.selectAll("text.xrule")
              .data(x.ticks(5))
              .enter().append("svg:text")
              .attr("class", "xrule")
              .attr("x", x)
              .attr("y", height - margin)
              .attr("dy", 20)
              .attr("text-anchor", "middle")
              .text(function (d) {
                var date = new Date(d);
                  console.log((date.getMonth() + 1) + "/" + date.getDate());
                return (date.getMonth() + 1) + "/" + date.getDate();
              });

          chart.selectAll("text.yrule")
              .data(y.ticks(10))
              .enter().append("svg:text")
              .attr("class", "yrule")
              .attr("x", width - margin)
              .attr("y", y)
              .attr("dy", 0)
              .attr("dx", 20)
              .attr("text-anchor", "middle")
              .text(String);
          chart.selectAll("rect")
              .data(data)
              .enter().append("svg:rect")
              .attr("x", function (d) {
                //return x(dateFormat.parse(d.Date).getTime());
                return x(new Date(d.qdate).getTime());
              })
              .attr("y", function (d) {

                return y(max(d.open, d.close));
              })
              .attr("height", function (d) {
                return y(min(d.open, d.close)) - y(max(d.open, d.close));
              })
              .attr("width", function (d) {
                return 0.25 * (width - 2 * margin) / data.length;
              })
              .attr("fill", function (d) {
                return d.open > d.close ? "red" : "green";
              });
          chart.selectAll("line.stem")
              .data(data)
              .enter().append("svg:line")
              .attr("class", "stem")
              .attr("x1", function (d) {
                //return x(dateFormat.parse(d.Date).getTime()) + 0.25 * (width - 2 * margin) / data.length;
                return x(new Date(d.qdate)) + 0.125 * (width - 2 * margin) / data.length;
              })
              .attr("x2", function (d) {
                //return x(dateFormat.parse(d.Date).getTime()) + 0.25 * (width - 2 * margin) / data.length;
                return x(new Date(d.qdate)) + 0.125 * (width - 2 * margin) / data.length;
              })
              .attr("y1", function (d) {
                return y(d.high);
              })
              .attr("y2", function (d) {
                return y(d.low);
              })
              .attr("stroke", function (d) {
                return d.open > d.close ? "red" : "green";
              })
        }

        function appendToData(x) {
          
          angular.forEach($scope.quotes, function (quote) {
            data.push(quote);
          });
            console.log(data);

            buildChart(data);

        }

      });





        /**$scope.showGraph = function() {
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

    }*/
      //});
    }
  }
]);




