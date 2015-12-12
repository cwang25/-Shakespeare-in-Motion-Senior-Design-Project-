/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
  mongoose = require('mongoose'),
  Quote = mongoose.model('Quote'),
  quoteCtr = require('../controllers/quote')(null);
/**
 * Globals
 */

var djcQuote;
var djiQuote;
var djcQuote2;

var req;
var res;
/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Controller quotes:', function() {
    beforeEach(function(done) {
      this.timeout(10000);
      //create mock req and res
      req = {};
      req.ip = "127.0.0.1";
      res = {};
      res.json_object="";
      //mock response .send method instead of actually sending response, print to console log.
      res.send = function(msg) {
        // fake the write method
        console.log("Mock response message received: "+msg);
        return msg;
      };
      //mock response .json method instead of actaully stringfy json object
      res.json = function(jsonobj) {
        // fake the json method
        console.log("Mock response json object received: "+jsonobj);
        res.json_object = jsonobj;
        //console.log(res.json+"===============");
        return jsonobj;
      };

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

      it('should be able to save through controller without problems', function(done) {
        this.timeout(10000);
        req.body = {
          qsymbol : "^DJC",
          qdate : "2015-10-10",
          open : "100",
          high : "150",
          low : "90",
          close : "110",
          adj_close : "115",
          volume : "20"
        };
        quoteCtr.create(req, res, function(){
          expect(res.json_object.qdate).to.be(req.body.qdate);
        });
        //
        done();
      });


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
