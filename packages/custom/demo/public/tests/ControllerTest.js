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


        describe('$scope.getNewsArticles', function () {
            var $scope, controller;

            beforeEach(function () {
                $scope = {};
                controller = $controller('DemoController', {$scope: $scope});
            });


            it('should return 4 news articles', inject(function ($http) {

                $scope.startDate = new Date("2015-10-05"); //1443931200000
                $scope.endDate = new Date("2015-10-09"); //1443931200000 + 86400000 * 5
                $httpBackend.whenGET('/api/demo/newsbydaterange?startdate=' + $scope.startDate + '&enddate=' +
                    $scope.endDate).respond([{}, {}, {}, {}]);
                $scope.getNewsArticles();
                $httpBackend.flush();
                expect($scope.newsarticles.length).toEqual(4);


            }));

            it('should set chart type to Candlestick', inject(function ($http) {
                expect($scope.chartTypes[0]).toEqual("Line");
                expect($scope.chartTypes[1]).toEqual("Candlestick");
                expect($scope.chartType).toEqual("Line");
                $scope.symbol = "";
                $scope.switchChartType("Candlestick");
                expect($scope.chartType).toEqual("Candlestick");

            }));

            it('should correctly identify the boundaries of a Mon-Fri date range', inject(function ($http) {
                $scope.eventDate = new Date("2015-10-04");
                $scope.symbol = "";
                $scope.selectWeek();
                expect($scope.startDate.getDay()).toEqual(0);    // In order for the REST API calls to return data for Monday-Friday,
                expect($scope.endDate.getDay()).toEqual(4);     // the date range in the URL parameters must have Sunday as its first date
                expect($scope.prevWeekEndDate.getDay()).toEqual(4);   // and Thursday as its last date. This was verified via acceptance tests.

            }));


        });


    });
});


