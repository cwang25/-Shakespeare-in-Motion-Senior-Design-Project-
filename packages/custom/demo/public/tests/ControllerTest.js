

/**
 * Created by sjchetty on 11/25/2015.
 */

'use strict';


describe('<Unit Test>', function () {
    describe('DemoController', function () {
        beforeEach(module('mean.demo'));
        var $controller, $httpBackend;

        beforeEach(inject(function (_$controller_, $injector) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
            $httpBackend = $injector.get('$httpBackend');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });


        describe('$scope.switchChartType', function () {
            var $scope, controller;

            beforeEach(function () {
                $scope = {};
                controller = $controller('DemoController', {$scope: $scope});

            });



            it('should set chart type to Candlestick', inject(function ($http) {
                expect($scope.chartTypes[0]).toEqual("Line");
                expect($scope.chartTypes[1]).toEqual("Candlestick");
                expect($scope.chartType).toEqual("Line");
                $scope.symbol = "";
                $scope.switchChartType("Candlestick");
                expect($scope.chartType).toEqual("Candlestick");

            }));
        });

        /**describe('$scope.generateDataDisplay', function () {
            var $scope, controller;

            beforeEach(function () {
                $scope = {};
                controller = $controller('DemoController', {$scope: $scope});
            });

            it('should get appropriate data for week 10/05/2015 - 10-09-2015', inject(function ($http) {
                Date.prototype.yyyymmdd = function () {
                    var yyyy = this.getFullYear().toString();
                    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
                    var dd = this.getDate().toString();
                    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
                };
                $scope.startDate = new Date("2015-10-05");
                $scope.endDate = new Date("2015-10-09");
                $scope.symbol = "^DJC";
                $httpBackend.whenGET('/api/demo/quotes_by_date_range?startdate=2015-10-05&enddate=2015-10-09&indexsymbol=' + $scope.symbol).respond(function (quotes) {
                    $httpBackend.flush();
                    expect($scope.quotes.length).toEqual(5);
                });
                $httpBackend.whenGET('/api/demo/newsbydaterange?startdate=2015-10-05&enddate=2015-10-09').respond(function (newsarticles) {
                    $httpBackend.flush();
                    expect($scope.articles.length).toEqual(4);
                });

                $httpBackend.whenGET('/api/demo/entitiesbydaterange?startdate=2015-10-05&enddate=2015-10-09').respond(function (entities) {
                    $httpBackend.flush();
                    expect($scope.entity.length).toEqual(2);



                });

                $httpBackend.whenGET('/api/demo/weeksum_by_date_index?date=2015-10-05&qsymbol=^DJC').respond(function(weeksum) {
                    $httpBackend.flush();
                    expect($scope.weekSummary.length).toEqual(1);
                    $scope.generateDataDisplay();
                });


            }));
        }); */


        describe('$scope.selectWeek', function () {
            var $scope, controller;

            beforeEach(function () {
                $scope = {};
                controller = $controller('DemoController', {$scope: $scope});
            });
            it('should make the start date Monday(1) and the end date Friday (5)', inject(function () {
                $scope.eventDate = new Date("2015-12-06");
                $scope.selectWeek();
                expect($scope.startDate.getDay()).toEqual(1);
                expect($scope.endDate.getDay()).toEqual(5);
            }));

            it('should make the start date Monday(1) and the end date Friday (5)', inject(function () {
                $scope.eventDate = new Date("2015-12-07");
                $scope.selectWeek();
                expect($scope.startDate.getDay()).toEqual(1);
                expect($scope.endDate.getDay()).toEqual(5);
            }));

            it('should make the start date Monday(1) and the end date Friday (5)', inject(function () {
                $scope.eventDate = new Date("2015-12-08");
                $scope.selectWeek();
                expect($scope.startDate.getDay()).toEqual(1);
                expect($scope.endDate.getDay()).toEqual(5);
            }));

            it('should make the start date Monday(1) and the end date Friday (5)', inject(function () {
                $scope.eventDate = new Date("2015-12-10");
                $scope.selectWeek();
                expect($scope.startDate.getDay()).toEqual(1);
                expect($scope.endDate.getDay()).toEqual(5);
            }));

            it('should make the start date Monday(1) and the end date Friday (5)', inject(function () {
                $scope.eventDate = new Date("2015-12-11");
                $scope.selectWeek();
                expect($scope.startDate.getDay()).toEqual(1);
                expect($scope.endDate.getDay()).toEqual(5);
            }));

            it('should make the start date Monday(1) and the end date Friday (5)', inject(function () {
                $scope.eventDate = new Date("2015-12-12");
                $scope.selectWeek();
                expect($scope.startDate.getDay()).toEqual(1);
                expect($scope.endDate.getDay()).toEqual(5);
            }));


        });

        describe('$scope.sentimentSummary', function () {
            var $scope, controller;

            beforeEach(function () {
                $scope = {};
                controller = $controller('DemoController', {$scope: $scope});

            });

            it('should calculate 50% positive articles and 50% negative articles', inject(function ($http) {
                $scope.articles = [];
                $scope.articles.push({sentiment: 0.75});
                $scope.articles.push({sentiment: -0.25});
                $scope.articles.push({sentiment: 0.33});
                $scope.articles.push({sentiment: -0.10});


                $scope.sentimentSummary();
                expect($scope.sentimentMsg).toEqual("50% Positive, 50% Negative");

            }));
        });

        describe('$scope.calculatePerformance', function () {
            var $scope, controller;
            beforeEach(function () {
                $scope = {};
                controller = $controller('DemoController', {$scope: $scope});

            });

            it('should calculate the % change as -1.68%', inject(function () {
                $scope.quotes = [];
                $scope.quotes.push({open: 87.5, close: 88.0});
                $scope.quotes.push({open: 88.5, close: 89.0});
                $scope.quotes.push({open: 89.5, close: 90.0});
                $scope.calculatePerformance();
                expect($scope.indexPerfMsg).toEqual("-1.68%");

            }));


        });












    });


});


