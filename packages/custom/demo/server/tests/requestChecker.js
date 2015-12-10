/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
  mongoose = require('mongoose'),
  rqChecker = require('../controllers/requestChecker');
/**
 * Globals
 */

var req;
var res;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
  describe('Request Checker Test:', function() {
    beforeEach(function(done) {
      req = {};
      res = {};
      //mock response .send method instead of actually sending response, print to console log.
      res.send = function(msg) {
        // fake the write method
        console.log("Mock response message received: "+msg);
      };
      done();
    });
    describe('Quote Save', function() {

      it('should return true if ip is at local', function(done) {
        this.timeout(10000);
        req.ip = "127.0.0.1";
        var rst = rqChecker.check_local(req, res);
        expect(rst).to.be(true);
        done();
      });

      it('should return false if ip is not at local', function(done) {
        this.timeout(10000);
        req.ip = "127.1.0.1";
        var rst = rqChecker.check_local(req, res);
        expect(rst).to.not.be(true);
        done();
      });

    });

    afterEach(function(done) {
      this.timeout(10000);
      done();
    });
  });
});
