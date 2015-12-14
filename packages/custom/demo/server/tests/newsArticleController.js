/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
    mongoose = require('mongoose'),
    NewsArticle = mongoose.model('NewsArticle'),
    newsArticleCtr = require('../controllers/newsArticle')(null);
/**
 * Globals
 */




var req;
var res;
/**
 * Test Suites
 */
describe('<Unit Test>', function() {
    describe('Controller newsArticles:', function() {
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

            done();
        });
        describe('NewsArticle Save', function() {

            it('should be able to save through controller without problems', function(done) {
                this.timeout(10000);
                req.body = {
                    newsDate: "2015-12-14",
                    title: "Fed Raises Interest Rates",
                    content: "Gold Falls",
                    url: "www.somewhere.com",
                    keywords:["Gold", "Fed"],
                    sentiment: "0.5"

                };
                newsArticleCtr.create(req, res, function(){
                    //console.log(res.json_object.qdate+"------"+req.body.qdate);
                    expect(res.json_object.title).to.equal("Gold Falls");

                });

                req.body = {
                    newsDate: "2015-12-15",
                    title: "Q3 GDP Revised Upward",
                    content: "Gold Falls",
                    url: "www.somewhere.com",
                    keywords:["GDP", "Gold"],
                    sentiment: "0.5"
                };
                newsArticleCtr.create(req, res, function(){
                    //console.log(res.json_object.qdate+"------"+req.body.qdate);
                    expect(res.json_object.title).to.equal("Gold Falls");

                });
                done();

                //
            });

            it('should be able to retrieve news articles in time range and also update through controller without problems', function(done) {
                this.timeout(10000);
                req.query = {
                    startdate : "2015-12-14",
                    enddate : "2015-12-15"
                };
                newsArticleCtr.newsintimerange(req, res, function(){
                    expect(res.json_object.length).to.equal(2);
                    req = {};
                    req.ip = "127.0.0.1";
                    req.newsarticle = res.json_object[0];
                    //update
                    req.body = {
                        sentiment : "0.7"
                    }
                    //req.body.high = 200;
                    newsArticleCtr.update(req, res, function(){
                        req = {};
                        req.query = {
                            startdate : "2015-12-14",
                            enddate : "2015-12-15"
                        };
                        newsArticleCtr.newsintimerange(req, res, function(){
                            //console.log("After update: -----\n"+ res.json_object[0]);
                            expect(res.json_object[0].sentiment).to.equal(0.7);
                            done();
                        });
                    });
                });
            });


            it('should be able to retrieve all news articles without problems', function(done) {
                this.timeout(10000);
                newsArticleCtr.all(req, res, function(){
                    console.log(res.json_object);
                    expect(res.json_object.length).to.equal(2);
                    done();
                });
            });

            it('should be able to delete through controller without problems', function(done) {
                this.timeout(10000);
                req.body = {
                    newsDate: "2015-12-15",
                    title: "Fed Raises Interest Rates",
                    content: "Gold Rebounds after Initial Drop",
                    url: "www.somewhere.com",
                    keywords:["Gold", "Fed"],
                    sentiment: "0.5"

                };
                //add dumb record to remove
                newsArticleCtr.create(req, res, function(){
                    //destry
                    req = {};
                    req.ip = "127.0.0.1";
                    req.newsarticle = res.json_object;

                    newsArticleCtr.destroy(req,res,function(){
                        newsArticleCtr.all(req, res, function(){
                            console.log(res.json_object);
                            expect(res.json_object.length).to.equal(2);
                            done();
                        });
                    });
                });
                //
            });

        });

        after(function(done) {
            this.timeout(10000);
            NewsArticle.remove({},function(err){
                done();
            });
        });
    });
});
