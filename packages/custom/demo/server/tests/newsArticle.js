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
    NewsArticle = mongoose.model('NewsArticle');
/**
 * Globals
 */

var article;
var article2;
var article3


/**
 * Test Suites
 */
describe('<Unit Test>', function() {
    describe('Model entities:', function() {
        beforeEach(function(done) {
            this.timeout(10000);
            article = new NewsArticle({
                newsDate : "2015-12-14",
                title : "Fed Raises Interest Rates",
                content : "First rate hike since 2006",
                URL: "www.somewhere.com",
                keywords: ["Fed", "Interest Rates"],
                sentiment:  "0.75"

            });

            article2 = new NewsArticle({
                title : "Fed Raises Interest Rates",
                content : "First rate hike since 2006",
                URL: "www.somewhere.com",
                keywords: ["Fed", "Interest Rates"],
                sentiment:  "0.75"

            });

            article3 = new NewsArticle({
                newsDate : "2015-12-14",
                title : "Fed Raises Interest Rates",
                content : "First rate hike since 2006",
                URL: "www.somewhere.com",
                keywords: ["Fed", "Interest Rates"]

            });

            done();
        });
        describe('NewsArticle Save', function() {

            it('should be able to save without problems', function(done) {
                this.timeout(10000);
                article.save(function(err, data) {
                    expect(err).to.be(null);
                    expect(data.title).to.equal("Fed Raises Interest Rates");
                    expect(data.sentiment).to.equal("0.75");
                    expect(data.content).to.equal("First rate hike since 2006");
                    expect(data.URL).to.equal("www.somewhere.com");
                    expect(data.keywords.length).to.equal("2");
                    article["_id"] = data._id;
                });

                article2.save(function(err, data) {
                    expect(err).to.be(null);

                });

                article3.save(function(err, data) {
                    expect(err).to.be(null);

                });

                done();
            });


            it('should be able to show an error when try to save missing title', function(done) {
                this.timeout(10000);
                article.title = '';
                return article.save(function(err) {
                    expect(err).to.not.be(null);
                    done();
                });
            });

            it('should be able to show an error when try to save missing content', function(done) {
                this.timeout(10000);
                article.content = '';
                return article.save(function(err) {
                    expect(err).to.not.be(null);
                    done();
                });
            });

        });

        afterEach(function(done) {
            this.timeout(10000);

            NewsArticle.remove({}).exec();
            done();
        });
    });
});

