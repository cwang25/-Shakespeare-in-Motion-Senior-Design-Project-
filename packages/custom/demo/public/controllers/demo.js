'use strict';

/* jshint -W098 */
angular.module('mean.demo').controller('DemoController', ['$scope', 'Global', 'Demo', '$http', '$timeout',
  function($scope, Global, Demo, $http, $timeout) {
    $scope.global = Global;
    $scope.package = {
      name: 'demo'
    };
    //$scope.$watch("newsarticles", function(){
    //  $timeout(function() {
    //    console.log('newsarticles updated.');
    //    window.$(".articlebody").readmore();
    //  });
   // })
    $scope.getNewsArticles = function () {
      $http.get('/api/demo/newsbydaterange?startdate='+ $scope.quote.startDate + '&enddate=' + $scope.quote.endDate).success(function (response) {
        console.log("I got the data I requested");
        $scope.newsarticles = response;
        $scope.news = "";
      });

    };
    //refresh();
      $scope.chartTypes = ['Line', 'Candlestick'];
      $scope.chartType = 'Line';

      $scope.switchChartType = function (type) {
          console.log(type);
         $scope.chartType = type;
          if(!($scope.quote.symbol.localeCompare("") == 0)) {
              $scope.showGraph();
          }
      };

      $scope.openDatePicker = function($event) {
          $scope.status.openedDatePicker = true;
      };
      $scope.status = {
          openedDatePicker: false
      };

      $scope.selectWeek = function() {

          if($scope.eventdate.getDay() == 0) {


              $scope.quote.startDate = new Date($scope.eventdate.getTime());
              $scope.quote.endDate = new Date($scope.eventdate.getTime() + 86400000 * 5);
              $scope.quote.prev_week_end_date = new Date($scope.eventdate.getTime() - (86400000 * 3));

          }
          if($scope.eventdate.getDay() == 1) {

              $scope.quote.startDate = new Date($scope.eventdate.getTime() - 86400000);
              $scope.quote.endDate = new Date($scope.eventdate.getTime() + 86400000 * 4);
              $scope.quote.prev_week_end_date = new Date($scope.eventdate.getTime() - (86400000 * 4));

          }
          if($scope.eventdate.getDay() == 2) {

              $scope.quote.startDate = new Date($scope.eventdate.getTime() - 86400000 * 2);
              $scope.quote.endDate = new Date($scope.eventdate.getTime() + 86400000 * 3);
              $scope.quote.prev_week_end_date = new Date( $scope.eventdate.getTime() - (86400000 * 5));

          }
          if($scope.eventdate.getDay() == 3) {

              $scope.quote.startDate = new Date($scope.eventdate.getTime() - 86400000 * 3);
              $scope.quote.endDate = new Date($scope.eventdate.getTime() + 86400000 * 2);
              $scope.quote.prev_week_end_date = new Date($scope.eventdate.getTime() - (86400000 * 6));

          }
          if($scope.eventdate.getDay() == 4) {

              $scope.quote.startDate = new Date($scope.eventdate.getTime() - 86400000 * 4);
              $scope.quote.endDate = new Date($scope.eventdate.getTime() + 86400000);
              $scope.quote.prev_week_end_date = new Date($scope.eventdate.getTime() - (86400000 * 7));

          }
          if($scope.eventdate.getDay() == 5) {

              $scope.quote.startDate = new Date($scope.eventdate.getTime() - 86400000 * 5);
              $scope.quote.endDate = new Date($scope.eventdate.getTime());
              $scope.quote.prev_week_end_date = new Date( $scope.eventdate.getTime() - (86400000 * 8));

          }
          if($scope.eventdate.getDay() == 6) {

              $scope.quote.startDate = new Date($scope.eventdate.getTime() - 86400000 * 6);
              $scope.quote.endDate = new Date($scope.eventdate.getTime());
              $scope.quote.prev_week_end_date = new Date($scope.eventdate.getTime() - (86400000 * 9));

          }

          Date.prototype.yyyymmdd = function() {
              var yyyy = this.getFullYear().toString();
              var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
              var dd  = this.getDate().toString();
              return yyyy +'-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
          };




          $http.get('/api/demo/analyze_week?startdate='+$scope.quote.prev_week_end_date.yyyymmdd() + '&enddate=' + $scope.quote.endDate.yyyymmdd()).success(function(response) {
               var data = response;
              if(!($scope.quote.symbol.localeCompare("") == 0)) {
                  $scope.showGraph();
              }

              if(!($scope.quote.symbol.localeCompare("") == 0)) {
                  $scope.calculatePerformance();
              }
              if(!($scope.quote.symbol.localeCompare("") == 0)) {
                  $scope.sentimentSummary();
              }
              if(!($scope.quote.symbol.localeCompare("") == 0)) {
                  $scope.getNewsArticles();
              }
          });








      };



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

      $scope.sentimentSummary = function() {
          $http.get('/api/demo/newsbydaterange?startdate='+ $scope.quote.startDate + '&enddate=' + $scope.quote.endDate).success(function(response) {
              $scope.articles = response;
              var positiveCount = 0;
              var negativeCount = 0;
              for(var i = 0; i < $scope.articles.length; i++) {
                  if($scope.articles[i].sentiment > 0) {
                      positiveCount++;
                  }
                  if($scope.articles[i].sentiment < 0) {
                      negativeCount++;
                  }
              }
              $scope.sentimentMsg = (positiveCount / $scope.articles.length * 100).toFixed(0) + "% Positive, " +
                                    (negativeCount / $scope.articles.length * 100).toFixed(0) + "% Negative";



          });

      }

      $scope.calculatePerformance = function() {
        $http.get('/api/demo/quotes_by_date_range?startdate=' + $scope.quote.prev_week_end_date + '&enddate=' + $scope.quote.endDate + '&indexsymbol=' + $scope.quote.symbol).success(function (response) {
            $scope.quotes = response;
            console.log($scope.quotes);
            var quotePrices = [];
            angular.forEach($scope.quotes, function (quote) {
                quotePrices.push(quote.close);
            });

            $scope.weeklyPercentChg = ((quotePrices[0] - quotePrices[quotePrices.length - 1]) /
                                        quotePrices[quotePrices.length - 1] * 100).toFixed(2);
            $scope.indexPerfMsg = "";
            if($scope.weeklyPercentChg > 0) {
                $scope.indexPerfMsg = "+ " + $scope.weeklyPercentChg + "%";
            }
            else {
                $scope.indexPerfMsg = $scope.weeklyPercentChg + "%";
            }


        });
    }

    $scope.removeNews = function (id) {

      $http.delete('/api/demo/newsarticles/' + id).success(function (response) {
        console.log(response);
        refresh();
      });
    };

    $scope.chart = null;


    $scope.showGraph = function () {
        console.log($scope.chartType);
        if ($scope.chartType.localeCompare('Line') == 0) {

            showLineChart();

        }
        if ($scope.chartType.localeCompare('Candlestick') == 0) {
            showCandleChart();


        }

        function showCandleChart() {
            if($scope.chart != null) {
                console.log("Hello");
                $scope.chart.destroy();
                $scope.chart = null;
            }
            //d3.select(".body").selectAll("svg").remove();
            $http.get('/api/demo/quotes_by_date_range?startdate=' + $scope.quote.startDate + '&enddate=' + $scope.quote.endDate + '&indexsymbol=' + $scope.quote.symbol).success(function (response) {
                console.log("I got the quotes I requested ");

                $scope.quotes = response;
                var width = 700;
                var height = 350;
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
                        .data(y.ticks(7))
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

        }


        function showLineChart() {
            d3.select("svg").remove();
            $scope.config = {};
            $http.get('/api/demo/quotes_by_date_range?startdate=' + $scope.quote.startDate + '&enddate=' + $scope.quote.endDate + '&indexsymbol=' + $scope.quote.symbol).success(function (response) {
                console.log("I got the quotes I requested ");


                $scope.quotes = response;
                console.log($scope.quotes);
                var quoteDates = [];
                quoteDates.push('Dates');

                var quotePrices = [];
                quotePrices.push($scope.quote.symbol);

                angular.forEach($scope.quotes, function (quote) {
                    quoteDates.push(new Date(quote.qdate));
                });

                angular.forEach($scope.quotes, function (quote) {
                    quotePrices.push(quote.close);
                });


                $scope.chart = c3.generate({
                    bindto: '#lineChart',
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
      //});
    }

]);

/** based on code found here: https://groups.google.com/forum/#!topic/twitter-bootstrap-stackoverflow/f21Us8kXFjI */

angular.module('mean.demo').directive('datepicker', function() {
    return {

        restrict: 'A',
        // Always use along with an ng-model
        require: '?ngModel',

        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {
                element.datepicker('update', ngModel.$viewValue || '');
            };

            element.datepicker().on("changeDate",function(event){
                scope.$apply(function() {
                    ngModel.$setViewValue(event.date);
                });
            });
        }
    };
});
angular.module('mean.demo').directive('readmore', ['$timeout', function($timeout) {
        return {
            restrict: 'CA',
            link: function(scope, element, attributes) {
                $timeout(function(){
                    angular.element(element).readmore(attributes);
                });
            }
        };  
    }]);

