'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    WeekSum = mongoose.model('WeekSum'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');
var rqChecker = require('./requestChecker');

module.exports = function(app) {

    return {
        /**
         * Find weeksum by id
         */
        weeksum: function(req, res, next, id) {
            WeekSum.load(id, function(err, weeksum) {
                if (err) return next(err);
                if (!weeksum) return next(new Error('Failed to load weeksum ' + id));
                req.weeksum = weeksum;
                next();
            });
        },
        /**
         * Create an weeksum
         * - private api
         */
        create: function(req, res, next) {
            if(rqChecker.check_local(req, res)){
                var weeksum = new WeekSum(req.body);
                //console.log(article);
                weeksum.save(function (err) {
                    if (err) {
                        console.log("Failed to store data: " + weeksum);
                        console.log(err);
                        return res.status(500).json({
                            error: 'Cannot save the weeksum',
                            message: req.body
                        });
                    }
                    res.json(weeksum);
                    if(typeof next === 'function' && req.mochaunittest == true) {
                        next();
                    }
                });
            }
        },
        /**
         * Update an weeksum
         * -private api
         */
        update: function(req, res, next) {
            if(rqChecker.check_local(req, rest)){
                var weeksum = req.weeksum;
                weeksum = _.extend(weeksum, req.body);
                weeksum.save(function (err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot update the weeksum'
                        });
                    }
                    res.json(weeksum);
                    if(typeof next === 'function' && req.mochaunittest == true) {
                        next();
                    }
                });
            }
        },
        /**
         * Delete an weeksum
         * -private api
         */
        destroy: function(req, res, next) {
            if (rqChecker.check_local(req, res)) {
                var weeksum = req.weeksum;
                weeksum.remove(function (err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot delete the article'
                        });
                    }
                    res.json(weeksum);
                    if(typeof next === 'function' && req.mochaunittest == true) {
                        next();
                    }
                });
            }
        },
        /**
         * Show an weeksum
         */
        show: function(req, res) {
            res.json(req.weeksum);
        },
        /**
         * Get weeksum in given time range
         * @param req
         * @param res
         * @param next
         */
        weeksum_by_date: function(req, res, next){
            var date = Date.parse(req.query.date);
            WeekSum.find({
                week_start_date: {
                    $lte: date
                },
                week_end_date: {
                    $gte: date
                },
                week_index: req.query.qsymbol
            }).exec(function(err, weeksums) {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                }
                res.json(weeksums)
                if(typeof next === 'function' && req.mochaunittest == true) {
                    next();
                }
            });
        },
        /**
         * List of WeekSum
         */
        all: function(req, res, next) {
            WeekSum.find({}).sort('-week_start_date').exec(function(err, weeksum) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the weeksum'
                    });
                }

                res.json(weeksum);
                if(typeof next === 'function' && req.mochaunittest == true) {
                    next();
                }
            });
        }
    };
}