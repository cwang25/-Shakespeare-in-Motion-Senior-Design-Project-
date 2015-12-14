/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
  mongoose = require('mongoose'),
  WeekSum = mongoose.model('WeekSum');
/**
 * Globals
 */

var weekSum1;
var weekSum2;
var weekSum3;
/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model WeekSum:', function() {
    beforeEach(function(done) {
      this.timeout(10000);
      weekSum1 = new WeekSum({
        week_start_date:"2015-11-30",
        week_end_date:"2015-12-04",
        week_index:"^DJC",
        bcom_indices:["1","2","3"],
        bcom_max:"90",
        bcom_min:"50",
        bcom_avg_slope:"5",
        bcom_week_momentum:"20",
        bcom_week_rsi:"20",
        articles:["4","5","6"],
        avg_articles_sentiment:"0.5"
      });
      weekSum2 = new WeekSum({
        week_start_date:"2015-11-30",
        week_end_date:"2015-12-04",
        week_index:"^DJI",
        bcom_indices:["1","2","3"],
        bcom_max:"15000",
        bcom_min:"11000",
        bcom_avg_slope:"50",
        bcom_week_momentum:"10",
        bcom_week_rsi:"5",
        articles:["4","5","6"],
        avg_articles_sentiment:"-1.0"
      });
      weekSum3 = new WeekSum({
        week_start_date:"2015-11-09",
        week_end_date:"2015-11-13",
        week_index:"^DJC",
        bcom_indices:["4","5","6"],
        bcom_max:"88",
        bcom_min:"40",
        bcom_avg_slope:"5",
        bcom_week_momentum:"20",
        bcom_week_rsi:"5",
        articles:["4","5","6"],
        avg_articles_sentiment:"0.7"
      });
      done();
    });
    describe('WeekSum Save', function() {
      it('should be able to save without problems', function(done) {
        this.timeout(10000);
        var data1, data2, data3;

        weekSum1.save(function(err, data) {
          expect(err).to.be(null);
          weekSum1["_id"] = data._id;
          data1 = data;
          console.log(data1+"*******");
          weekSum2.save(function(err, data) {
            expect(err).to.be(null);
            weekSum2["_id"] = data._id;
            data2 = data;
            weekSum3.save(function(err, data) {
              expect(err).to.be(null);
              weekSum3["_id"] = data._id;
              data3 = data;
              expect(data1.bcom_max).to.equal(90);
              expect(data2.bcom_max).to.equal(15000);
              expect(data3.bcom_max).to.equal(88);
              done();
            });
          });
        });
      });

      it('should save without problems', function(done) {
        this.timeout(10000);
        weekSum1.save(function(err) {
          expect(err).to.be(null);
          done();
        });
      });


      it('should be able to show an error when try to save missing date record', function(done) {
        this.timeout(10000);
        weekSum1.week_end_date = '';
        weekSum1.save(function(err) {
          expect(err).to.not.be(null);
          done();
        });
      });
      it('should be able to show an error when try to save missing date record', function(done) {
        this.timeout(10000);
        weekSum1.week_start_date = '';
        weekSum1.save(function(err) {
          expect(err).to.not.be(null);
          done();
        });
      });

    });

    afterEach(function(done) {
      this.timeout(10000);

      WeekSum.remove({}).exec();
      done();
    });
  });
});



