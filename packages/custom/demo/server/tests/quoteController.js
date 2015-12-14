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
        console.log("Mock response message received"+msg);
      };
      //mock response .json method instead of actaully stringfy json object
      res.json = function(jsonobj) {
        // fake the json method
        console.log("Mock response json object received");
        res.json_object = jsonobj;
        //console.log(res.json+"===============");
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
          //console.log(res.json_object.qdate+"------"+req.body.qdate);
          expect(res.json_object.qsymbol).to.equal(req.body.qsymbol);
          done();
        });

        //
      });

      it('should be able to retrieve quotes in time range and also update through controller without problems', function(done) {
        this.timeout(10000);
        req.query = {
          startdate : "2015-10-10",
          enddate : "2015-10-10"
        };
        quoteCtr.quotes_in_time_range(req, res, function(){
          expect(res.json_object[0].high).to.equal(150);
          req = {};
          req.ip = "127.0.0.1";
          req.quote = res.json_object[0];
          //update
          req.body = {
            high : "200"
          }
          //req.body.high = 200;
          quoteCtr.update(req, res, function(){
            req = {};
            req.query = {
              startdate : "2015-10-10",
              enddate : "2015-10-10"
            };
            quoteCtr.quotes_in_time_range(req, res, function(){
              //console.log("After update: -----\n"+ res.json_object[0]);
              expect(res.json_object[0].high).to.equal(200);
              done();
            });
          });
        });
      });

      it('should be able to retrieve quotes by symbol without problems', function(done) {
        this.timeout(10000);
        req.query = {
          indexsymbol:"^DJC"
        };
        quoteCtr.quotes_by_symbol(req, res, function(){
          console.log(res.json_object);
          expect(res.json_object[0].qsymbol).to.equal("^DJC");
          done();
        });
      });
      it('should be able to retrieve all quotes without problems', function(done) {
        this.timeout(10000);
        quoteCtr.all(req, res, function(){
          console.log(res.json_object);
          expect(res.json_object[0].qsymbol).to.equal("^DJC");
          done();
        });
      });

      it('should be able to delete through controller without problems', function(done) {
        this.timeout(10000);
        req.body = {
          qsymbol : "^DJC",
          qdate : "2015-10-12",
          open : "100",
          high : "150",
          low : "90",
          close : "110",
          adj_close : "115",
          volume : "20"
        };
        //add dumb record to remove
        quoteCtr.create(req, res, function(){
          expect(res.json_object.qsymbol).to.equal(req.body.qsymbol);
          //destry
          req = {};
          req.ip = "127.0.0.1";
          req.quote = res.json_object;

          quoteCtr.destroy(req,res,function(){
            quoteCtr.all(req, res, function(){
              console.log(res.json_object);
              expect(res.json_object.length).to.equal(1);
              done();
            });
          });
        });
        //
      });

    });

    after(function(done) {
      this.timeout(10000);
      Quote.remove({},function(err){
        done();
      });
    });
  });
});
