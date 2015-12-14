'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Quote = mongoose.model('Quote'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');
var rqChecker = require('./requestChecker');

module.exports = function(app) {

    return {
        /**
         * Find quote by id
         */
        quote: function(req, res, next, id) {
            Quote.load(id, function(err, quote) {
                if (err) return next(err);
                if (!quote) return next(new Error('Failed to load quote ' + id));
                req.quote = quote;
                next();
            });
        },
        /**
         * Create an quote
         * - private api
         * next optional callback function
         */
        create: function(req, res, next) {
            if(rqChecker.check_local(req, res)){
                var quote = new Quote(req.body);
                //console.log(article);
                quote.save(function (err) {
                    if (err) {
                        console.log("Failed to store data: " + quote);
                        console.log(err);
                        return res.status(500).json({
                            error: 'Cannot save the quote',
                            message: req.body
                        });
                    }
                    res.json(quote);
                    //ensure the callback is there.
                    if(typeof next === 'function') {
                        next();
                    }
                });
            }
        },
        /**
         * Update an quote
         * -private api
         */
        update: function(req, res, next) {
            if(rqChecker.check_local(req, res)){
                var quote = req.quote;
                quote = _.extend(quote, req.body);
                quote.save(function (err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot update the quote'
                        });
                    }
                    res.json(quote);
                    //ensure the callback is there.
                    //ensure the callback is there.
                    if(typeof next === 'function') {
                        next();
                    }
                });
            }
        },
        /**
         * Delete an quote
         * -private api
         */
        destroy: function(req, res, next) {
            if (rqChecker.check_local(req, res)) {
                var quote = req.quote;
                quote.remove(function (err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot delete the article'
                        });
                    }
                    res.json(quote);
                    //ensure the callback is there.
                    //ensure the callback is there.
                    if(typeof next === 'function') {
                        next();
                    }
                });
            }
        },
        /**
         * Show an quote
         */
        show: function(req, res) {
            res.json(req.quote);
        },
        /**
         * Get quote in given time range
         * @param req
         * @param res
         * @param next
         */
        quotes_in_time_range: function(req, res, next){
            var date1 = Date.parse(req.query.startdate);
            var date2 = Date.parse(req.query.enddate);
            var sym = req.query.indexsymbol;
            Quote.find({
                qdate: {
                    $gte: date1,
                    $lte: date2
                },
                qsymbol:sym
            }).sort('-qdate').exec(function(err, quotes) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the qutoes'
                    });
                }
                res.json(quotes)
                //ensure the callback is there.
                if(typeof next === 'function') {
                    next();
                }
            });
        },
        /**
         * List of Quotes
         */
        all: function(req, res, next) {
            Quote.find({}).sort('-qdate').exec(function(err, quote) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the quotes'
                    });
                }

                res.json(quote)
                //ensure the callback is there.
                if(typeof next === 'function') {
                    next();
                }
            });
        },
        /**
         * Get quote by symbol
         * @param req
         * @param res
         * @param next
         */
        quotes_by_symbol: function (req, res, next){
            var sym = req.query.indexsymbol;
            Quote.aggregate({
                $match:{
                    qsymbol:sym
                }
            }).sort('-qdate').exec(function(err, quotes){
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the qutoes'
                    });
                }
                res.json(quotes)
                //ensure the callback is there.
                if(typeof next === 'function') {
                    next();
                }
            });
        }
    };
}