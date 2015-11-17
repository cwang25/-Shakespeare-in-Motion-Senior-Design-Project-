/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
  mongoose = require('mongoose'),
  Quote = mongoose.model('Quote');
/**
 * Globals
 */

var djcQuote;
var djiQuote;
var djcQuote2;
/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Model quotes:', function() {
    beforeEach(function(done) {
      this.timeout(10000);
      djcQuote = new Quote({
        qsymbol : "^DJC",
        qdate : "2015-10-10",
        open : "100",
        high : "150",
        low : "90",
        close : "110",
        adj_close : "115",
        volume : "20"
      });
      djcQuote2 = new Quote({
        qsymbol : "^DJC",
        qdate : "2015-10-12",
        open : "80",
        high : "120",
        low : "50",
        close : "110",
        adj_close : "112",
        volume : "35"
      });
      djiQuote = new Quote({
        qsymbol: "^DJI",
        qdate: "2015-10-11",
        open: "10000",
        high: "15000",
        low: "9000",
        close: "11000",
        adj_close: "11500",
        volume: "200000"
      });
      done();
    });
    describe('Quote Save', function() {

      it('should be able to save without problems', function(done) {
        this.timeout(10000);
        djcQuote.save(function(err, data) {
          expect(err).to.be(null);
          expect(data.high).to.equal("150");
          expect(data.low).to.equal("90");
          djcQuote["_id"] = data._id;
        });
        djcQuote2.save(function(err, data) {
          expect(err).to.be(null);
          expect(data.high).to.equal("15000");
          expect(data.low).to.equal("9000");
          djcQuote2["_id"] = data._id;

        });
        djiQuote.save(function(err, data) {
          expect(err).to.be(null);
          expect(data.high).to.equal("120");
          expect(data.low).to.equal("50");
          djiQuote["_id"] = data._id;
        });
        done();
      });

      //it('should be able to show an error when try to save duplicate record', function(done) {
      //  this.timeout(10000);
      //  //djcQuote.save(function(err, data) {
      //  //  expect(err).to.be(null);
      //  //  expect(data.high).to.equal("150");
      //  //  expect(data.low).to.equal("90");
      //  //  djcQuote["_id"] = data._id.str;
      //  //});
      //  var djcQuoteDup = new Quote({
      //    qsymbol : "^DJC",
      //    qdate : "2015-10-10",
      //    open : "100",
      //    high : "150",
      //    low : "90",
      //    close : "110",
      //    adj_close : "115",
      //    volume : "20"
      //  });
      //  djcQuoteDup.save(function(err, data){
      //    expect(err).to.be(null);
      //    console.log(Quote.find({}));
      //    done();
      //  });
      //
      //
      //});

      it('should be able to show an error when try to save missing date record', function(done) {
        this.timeout(10000);
        djcQuote.qdate = '';
        return djcQuote.save(function(err) {
          expect(err).to.not.be(null);
          done();
        });
      });

    });

    afterEach(function(done) {
      this.timeout(10000);

      Quote.remove({}).exec();
      done();
    });
  });
});
