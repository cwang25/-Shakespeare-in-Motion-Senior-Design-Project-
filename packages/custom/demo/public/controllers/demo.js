'use strict';

/* jshint -W098 */
angular.module('mean.demo').controller('DemoController', ['$scope', 'Global', 'Demo', '$http', '$timeout',
  function($scope, Global, Demo, $http, $timeout) {
      $scope.global = Global;
      $scope.package = {
          name: 'demo'
      };
      $scope.SATURDAY = 6;
      $scope.FRIDAY = 5;
      $scope.MONDAY = 1;
      $scope.SUNDAY = 0;
      $scope.MILLISECONDS_PER_DAY = 86400000;
      $scope.MILLISECONDS_PER_HOUR = 3600000;


      //refresh();
      $scope.chartTypes = ['Line', 'Candlestick'];
      $scope.chartType = 'Line';

      $scope.switchChartType = function (type) {
          console.log(type);
          $scope.chartType = type;
          if (!($scope.symbol.localeCompare("") == 0)) {
              $scope.showGraph();
          }

          $scope.textWordCloud();
      };

      $scope.openDatePicker = function ($event) {
          $scope.status.openedDatePicker = true;
      };
      $scope.status = {
          openedDatePicker: false
      };

      $scope.selectWeek = function () {
          var day = $scope.eventDate.getDay();
          var timeInMilliseconds = $scope.eventDate.getTime();
          if (day == $scope.SUNDAY) {


              $scope.startDate = new Date(timeInMilliseconds + $scope.MILLISECONDS_PER_DAY);
              $scope.endDate = new Date(timeInMilliseconds + ($scope.MILLISECONDS_PER_DAY *
                  $scope.FRIDAY) + $scope.MILLISECONDS_PER_HOUR);

          }
          if (day >= $scope.MONDAY && day <= $scope.FRIDAY) {
              $scope.startDate = new Date(timeInMilliseconds - ((day - $scope.MONDAY) * $scope.MILLISECONDS_PER_DAY));
              $scope.endDate = new Date(timeInMilliseconds + (($scope.FRIDAY - day) * $scope.MILLISECONDS_PER_DAY));

          }

          if (day == $scope.SATURDAY) {

              $scope.startDate = new Date(timeInMilliseconds - ($scope.MILLISECONDS_PER_DAY * 5));
              $scope.endDate = new Date(timeInMilliseconds - $scope.MILLISECONDS_PER_DAY);

          }


      }

      //This function is called when the user clicks "Display" on the html page
      $scope.getData = function () {
          if (($scope.symbol.localeCompare("") == 0)) {
              return;
          }
          $scope.selectWeek();
          Date.prototype.yyyymmdd = function () {
              var yyyy = this.getFullYear().toString();
              var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
              var dd = this.getDate().toString();
              return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
          };

          // First check to see if there is a weeksum in the database for the requested week.
          // If a weeksum cannot be found, call analyze week to get the data.
          // If the weeksum was available, make the get-rest calls to get the data from the database
          $http.get('/api/demo/weeksum_by_date_index?date=' + $scope.startDate.yyyymmdd() + '&qsymbol=' + $scope.symbol).success(function (response) {
              if (response.length > 0) {
                  $scope.generateDataDisplay();

              }
              else {
                  $http.get('/api/demo/crawl_and_generate_week_summary?startdate=' + $scope.startDate.yyyymmdd() + '&enddate=' +
                      $scope.endDate.yyyymmdd() + '&qsymbol=' + $scope.symbol).success(function (response) {
                      $scope.generateDataDisplay();


                  });

              }

          });

      }

      $scope.generateDataDisplay = function () {
          $http.get('/api/demo/quotes_by_date_range?startdate=' + $scope.startDate.yyyymmdd() +
              '&enddate=' + $scope.endDate.yyyymmdd() + '&indexsymbol=' + $scope.symbol).success(function (response) {
              $scope.quotes = response;
              if (!($scope.symbol.localeCompare("") == 0)) {
                  $scope.showGraph();
                  $scope.calculatePerformance();
              }
          });

          $http.get('/api/demo/newsbydaterange?startdate=' + $scope.startDate.yyyymmdd() +
              '&enddate=' + $scope.endDate.yyyymmdd()).success(function (response) {
              $scope.articles = response;
              $scope.sentimentSummary();
              $scope.keywordSummary();
              $scope.textWordCloud();
          });
          $http.get('/api/demo/entitiesbydaterange?startdate=' + $scope.startDate.yyyymmdd() +
              '&enddate=' + $scope.endDate.yyyymmdd()).success(function (response) {
              $scope.entity = response;

              $scope.entitySummary();


          });

      }


      $scope.sentimentSummary = function () {

          var positiveCount = 0;
          var negativeCount = 0;
          for (var i = 0; i < $scope.articles.length; i++) {
              if ($scope.articles[i].sentiment > 0) {
                      positiveCount++;
                  }
              if ($scope.articles[i].sentiment < 0) {
                      negativeCount++;
                  }
              }
              $scope.sentimentMsg = (positiveCount / $scope.articles.length * 100).toFixed(0) + "% Positive, " +
                  (negativeCount / $scope.articles.length * 100).toFixed(0) + "% Negative";

      }

      $scope.keywordSummary = function () {

              $('#key_div').empty();

              var weekly_keywords = [];
              var text_box = document.getElementById("key_div");

          for (var i = 0; i < $scope.articles.length; i++) {
                  weekly_keywords = weekly_keywords.concat($scope.articles[i].keywords);
              }

              var counts = _.countBy(weekly_keywords, _.identity);
          for (var i = 0; i < 10; i++) {
              if (weekly_keywords.length == 0) {
                  break;
              }
              var new_row = document.createElement("tr");
              var words_dt = document.createElement("td");
              var values_dt = document.createElement("td");

              var mx = _.max(weekly_keywords, function (keyword) {
                  return counts[keyword];
              });
              words_dt.appendChild(document.createTextNode((i + 1).toString() + ") " + mx));
              values_dt.appendChild(document.createTextNode("mentioned " + counts[mx].toString() + " times"));

              weekly_keywords = _.without(weekly_keywords, mx);
              new_row.appendChild(words_dt)
              new_row.appendChild(values_dt)
              text_box.appendChild(new_row)


              }


      }

      $scope.entitySummary = function () {

              $('#entity_div').empty();
              var text_box = document.getElementById("entity_div");

          for (var i = 0; i < $scope.entity.length; i++) {
              if ($scope.entity[i].sentiment >= 0) {
                      var pos_div = document.createElement("div");
                      pos_div.style.color = "rgb(0," + Math.round(255 * $scope.entity[i].sentiment).toString() + ",0)";
                      pos_div.appendChild(document.createTextNode($scope.entity[i].text));
                      text_box.appendChild(pos_div);
                  }
              if ($scope.entity[i].sentiment < 0) {
                      var neg_div = document.createElement("div");
                      neg_div.style.color = "rgb(" + Math.round(-255 * $scope.entity[i].sentiment).toString() + ",0,0)";
                      neg_div.appendChild(document.createTextNode($scope.entity[i].text));
                      text_box.appendChild(neg_div);
                  }

              }


      }

      $scope.textWordCloud = function () {

              $('#cloud_div').empty();

              var weekly_text = [];

          for (var i = 0; i < $scope.articles.length; i++) {
                  weekly_text = weekly_text.concat($scope.articles[i].content);
              }
              var weekly_keywords = [];
              var top_words = [];

          for (var j = 0; j < $scope.articles.length; j++) {
                  weekly_keywords = weekly_keywords.concat($scope.articles[j].keywords);
              }
              var counts = _.countBy(weekly_keywords, _.identity);

          for (var k = 0; k < 30; k++) {
              if (weekly_keywords.length == 0) {
                  break;
              }
              var mx = _.max(weekly_keywords, function (keyword) {
                  return counts[keyword];
              });
              top_words = top_words.concat(mx);
              weekly_keywords = _.without(weekly_keywords, mx);
              }

              var color = d3.scale.linear()
                  .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                  .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

              var fill = d3.scale.category20();

              var dh = $("#cloud_div").height();
              var dw = $("#cloud_div").width();


              d3.layout.cloud().size([dw, dh])
                  .words(_.keys(counts).map(function (d) {
                      return {text: d, size: counts[d] * 10};
                  }))
                  .rotate(0)
                  .font("Impact")
                  .fontSize(function (d) {
                      return d.size;
                  })
                  .padding(1)
                  .on("end", draw)
                  .start();

              function draw(words) {
                  d3.select("#cloud_div").append("svg")
                      .attr("width", dw)
                      .attr("height", dh)
                      .append("g")
                      .attr("transform", "translate(" + Math.round((dw / 2)).toString() + "," + Math.round((dh / 2)).toString() + ")")
                      .selectAll("text")
                      .data(words)
                      .enter().append("text")
                      .style("font-size", function (d) {
                          return d.size + "px";
                      })
                      .style("font-family", "Impact")
                      .style("fill", function (d, i) {
                          return color(i);
                      })
                      .attr("text-anchor", "middle")
                      .attr("transform", function (d) {
                          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                      })
                      .text(function (d) {
                          return d.text;
                      });
              }


      }

      $scope.calculatePerformance = function () {

          var weekOpen = $scope.quotes[$scope.quotes.length - 1].open;
          var weekClose = $scope.quotes[0].close;

          $scope.weeklyPercentChg = (((weekClose - weekOpen) /
          weekOpen) * 100).toFixed(2);
          $scope.indexPerfMsg = "";
          if ($scope.weeklyPercentChg > 0) {
              $scope.indexPerfMsg = "+ " + $scope.weeklyPercentChg + "%";
          }
          else {
              $scope.indexPerfMsg = $scope.weeklyPercentChg + "%";
          }


      }


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
              //candlestick code based on https://gist.github.com/abeppu/1074045
              if ($scope.chart != null) {

                  $scope.chart.destroy();
                  $scope.chart = null;
              }
              //d3.select(".body").selectAll("svg").remove();


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


          }


          function showLineChart() {
              console.log(new Date($scope.quotes[0].qdate).getTime());
              d3.select("svg").remove();
              $scope.config = {};


              console.log($scope.quotes);
              var quoteDates = [];
              quoteDates.push('Dates');

              var quotePrices = [];
              quotePrices.push($scope.symbol);

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


          }

      }

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

//modified from the github issues page of readmore about angularJS compatibility
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
