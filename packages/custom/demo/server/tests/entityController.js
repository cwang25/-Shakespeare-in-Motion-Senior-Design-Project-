/**
 * Created by sjchetty on 12/14/2015.
 */

/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
    mongoose = require('mongoose'),
    Entity = mongoose.model('Entity'),
    entityCtr = require('../controllers/entity')(null);
/**
 * Globals
 */


var req;
var res;
/**
 * Test Suites
 */
describe('<Unit Test>', function() {
    describe('Entities:', function() {
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

            done();
        });
        describe('Entity Save', function() {

            it('should be able to save through controller without problems', function(done) {
                this.timeout(10000);
                req.body = {
                    entityDate : "2015-12-14",
                    text : "Federal Reserve",
                    count : "10",
                    sentiment: "0.5"
                };
                entityCtr.create(req, res, function(){
                    expect(res.json_object.text).to.be(req.body.text);
                });

                req.body = {
                    entityDate : "2015-12-15",
                    text : "Inflation",
                    count : "10"

                };

                entityCtr.create(req, res, function(){
                    expect(res.json_object.text).to.be(req.body.text);
                });

                //
                done();
            });

            it('should be able to retrieve entities in time range and also update through controller without problems', function(done) {
                this.timeout(10000);
                req.query = {
                    startdate : "2015-12-14",
                    enddate : "2015-12-15"
                };
                entityCtr.entitiesintimerange(req, res, function(){
                    console.log(res.json_object);
                    expect(res.json_object.length).to.be(2);
                    req = {};
                    req.ip = "127.0.0.1";
                    req.entity = res.json_object[0];
                    //update
                    req.entity.count = 7;
                    res = {};
                    entityCtr.update(req, res, function(){
                        entityCtr.entitiesintimerange(req, res, function(){
                            console.log("After update: -----\n"+ res.json_object[0]);
                            expect(res.json_object[0].count).to.be(7);
                        });
                    });
                });
                done();
            });

            it('should be able to retrieve all entities without problems', function(done) {
                this.timeout(10000);
                entityCtr.all(req, res, function(){
                    console.log(res.json_object.length);
                    expect(res.json_object.length).to.be(2);
                });
                done();
            });

            it('should be able to delete through controller without problems', function(done) {
                this.timeout(10000);
                req.body = {
                    entityDate : "2015-12-17",
                    text : "Silver",
                    count : "3",
                    sentiment: "-0.7"
                };
                //add dumb record to remove
                entityCtr.create(req, res, function(){
                    expect(res.json_object.text).to.be(req.body.text);
                    //destry
                    req = {};
                    req.ip = "127.0.0.1";
                    req.quote = res.json_object;
                    entityCtr.destroy(req,res,function(){
                        entityCtr.all(req, res, function(){
                            console.log(res.json_object);
                            expect(res.json_object.length).to.be(2);
                        });
                    })
                });
                //
                done();
            });

        });

        after(function(done) {
            this.timeout(10000);
            Entity.remove({},function(err){
                console.log("db cleaned");
                done();
            });
        });
    });
});

