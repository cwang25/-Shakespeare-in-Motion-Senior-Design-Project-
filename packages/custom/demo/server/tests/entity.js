/* jshint -W079 */
/* Related to https://github.com/linnovate/mean/issues/898 */
'use strict';

/**
 * Module dependencies.
 */
var expect = require('expect.js'),
    mongoose = require('mongoose'),
    Entity = mongoose.model('Entity');
/**
 * Globals
 */

var entity1;
var entity2;
var entity3;

/**
 * Test Suites
 */
describe('<Unit Test>', function() {
    describe('Model entities:', function() {
        beforeEach(function(done) {
            this.timeout(10000);
            entity1 = new Entity({
                entityDate : "2015-12-14",
                text : "Federal Reserve",
                count : "10",
                sentiment: "0.5"

            });
            entity2 = new Entity({
                entityDate : "2015-12-14",
                text : "Inflation",
                count : "7"

            });
            entity3 = new Entity({
                text : "Gold Supply",
                count : "2",
                sentiment: "-0.30"
            });
            done();
        });
        describe('Entity Save', function() {

            it('should be able to save without problems', function(done) {
                this.timeout(10000);
                entity1.save(function(err, data) {
                    expect(err).to.be(null);
                    expect(data.text).to.equal("Federal Reserve");
                    expect(data.count).to.equal("10");
                    expect(data.sentiment).to.equal("0.5");
                    entity1["_id"] = data._id;
                });
                entity2.save(function(err, data) {
                    expect(err).to.be(null);
                    expect(data.text).to.equal("Inflation");
                    expect(data.count).to.equal("7");
                    entity2["_id"] = data._id;

                });
                entity3.save(function(err, data) {
                    expect(err).to.be(null);
                    expect(data.text).to.equal("Gold Supply");
                    expect(data.count).to.equal("2");
                    entity3["_id"] = data._id;
                });
                done();
            });


            it('should be able to show an error when try to save missing text', function(done) {
                this.timeout(10000);
                entity1.text = '';
                return entity1.save(function(err) {
                    expect(err).to.not.be(null);
                    done();
                });
            });

            it('should be able to show an error when try to save missing count', function(done) {
                this.timeout(10000);
                entity1.count = '';
                return entity1.save(function(err) {
                    expect(err).to.not.be(null);
                    done();
                });
            });

        });

        afterEach(function(done) {
            this.timeout(10000);

            Entity.remove({}).exec();
            done();
        });
    });
});
