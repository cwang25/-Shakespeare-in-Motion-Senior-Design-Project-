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
        describe('NewsArticle Save', function() {

            it('should be able to save through controller without problems', function(done) {
                this.timeout(10000);
                req.body = {
                    newsDate : "2015-12-14",
                    title : "Fed Raises Interest Rates",
                    content : "First rate hike since 2006",
                    URL: "www.somewhere.com",
                    keywords: ["Fed", "Interest Rates"],
                    sentiment:  "0.75"
                };
                newsArticleCtr.create(req, res, function(){
                    expect(res.json_object.title).to.be(req.body.title);
                });

                req.body = {
                    newsDate : "2015-12-15",
                    title : "Gold Rises",
                    content : "Inflation Expectations Up",
                    URL: "www.website.com",
                    keywords: ["Inflation", "Gold"],
                    sentiment:  "0.75"

                };

                newsArticleCtr.create(req, res, function(){
                    expect(res.json_object.title).to.be(req.body.title);
                });

                //
                done();
            });

            it('should be able to retrieve news articles in time range and also update through controller without problems', function(done) {
                this.timeout(10000);
                req.query = {
                    startdate : "2015-12-14",
                    enddate : "2015-12-15"
                };
                newsArticleCtr.newsintimerange(req, res, function(){
                    console.log(res.json_object);
                    expect(res.json_object.length).to.be(2);
                    req = {};
                    req.ip = "127.0.0.1";
                    req.entity = res.json_object[0];
                    //update
                    req.entity.sentiment = 0.80;
                    res = {};
                    newsArticleCtr.update(req, res, function(){
                        newsArticleCtr.newsintimerange(req, res, function(){
                            console.log("After update: -----\n"+ res.json_object[0]);
                            expect(res.json_object[0].sentiment).to.be(0.80);
                        });
                    });
                });
                done();
            });

            it('should be able to retrieve all news articles without problems', function(done) {
                this.timeout(10000);
                newsArticleCtr.all(req, res, function(){
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
                newsArticleCtr.create(req, res, function(){
                    expect(res.json_object.text).to.be(req.body.text);
                    //destry
                    req = {};
                    req.ip = "127.0.0.1";
                    req.quote = res.json_object;
                    newsArticleCtr.destroy(req,res,function(){
                        newsArticleCtr.all(req, res, function(){
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
            NewsArticle.remove({},function(err){
                console.log("db cleaned");
                done();
            });
        });
    });
});

