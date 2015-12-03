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
        describe('$scope.getData', function () {
            var $scope, controller;

            beforeEach(function () {
                $scope = {};
                controller = $controller('DemoController', {$scope: $scope});
            });

            it('should get appropriate data for week 10/05/2015 - 10-09-2015', inject(function ($http) {
                $scope.eventDate = new Date("2015-10-07");
                $scope.symbol = "^DJC";
                $httpBackend.whenGET('/api/demo/weeksum_by_date?date=' + $scope.endDate).respond(function (weeksum) {
                    $httpBackend.whenGET('/api/demo/quotes_by_date_range?startdate=' + $scope.startDate +
                        '&enddate=' + $scope.endDate + '&indexsymbol=' + $scope.symbol).respond(function (quotes) {
                        $httpBackend.whenGET('/api/demo/newsbydaterange?startdate=' + $scope.startDate +
                            '&enddate=' + $scope.endDate).respond(function (newsarticles) {
                            $httpBackend.whenGET('/api/demo/entitiesbydaterange?startdate=' + $scope.startDate +
                                '&enddate=' + $scope.endDate).respond(function (entities) {
                                $scope.getData();
                                $httpBackend.flush();
                                $httpBackend.flush();
                                expect($scope.quotes.length).toEqual(5);
                                $httpBackend.flush();
                                expect($scope.articles.length).toEqual(4);
                                $httpBackend.flush();
                                expect($scope.entity.length).toEqual(2);


                            });
                        });
                    });
                });


            }));
        });


    });


});


