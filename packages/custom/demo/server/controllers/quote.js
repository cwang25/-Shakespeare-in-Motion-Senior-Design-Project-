'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Quote = mongoose.model('Quote'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Articles) {

    return {
        /**
         * Find article by id
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
         * Create an article
         */
        create: function(req, res) {
            var quote = new Quote(req.body);
            //console.log(article);
            quote.save(function(err) {
                if (err) {
                    console.log("Failed to store data: "+quote);
                    return res.status(500).json({
                        error: 'Cannot save the quote',
                        message: req.body
                    });
                }

                //Articles.events.publish({
                //    action: 'created',
                //    user: {
                //        name: req.user.name
                //    },
                //    url: config.hostname + '/articles/' + article._id,
                //    name: article.title
                //});

                res.json(quote);
            });
        },
        /**
         * Update an article
         */
        update: function(req, res) {
            var quote = req.quote;

            quote = _.extend(quote, req.body);


            quote.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the quote'
                    });
                }

                //Articles.events.publish({
                //    action: 'updated',
                //    user: {
                //        name: req.user.name
                //    },
                //    name: article.title,
                //    url: config.hostname + '/articles/' + article._id
                //});

                res.json(quote);
            });
        },
        /**
         * Delete an article
         */
        destroy: function(req, res) {
            var quote = req.quote;


            quote.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot delete the article'
                    });
                }

                //Articles.events.publish({
                //    action: 'deleted',
                //    user: {
                //        name: req.user.name
                //    },
                //    name: article.title
                //});

                res.json(quote);
            });
        },
        /**
         * Show an article
         */
        show: function(req, res) {

            //Articles.events.publish({
            //    action: 'viewed',
            //    user: {
            //        name: req.user.name
            //    },
            //    name: req.article.title,
            //    url: config.hostname + '/articles/' + req.article._id
            //});

            res.json(req.quote);
        },
        quotes_in_time_range: function(req, res, next){
            var date1 = Date.parse(req.query.startdate);
            var date2 = Date.parse(req.query.enddate);
            var sym = req.query.indexsymbol;
            Quote.find({
                qdate: {
                    $gte: date1,
                    $lte: date2
                },
                symbol:sym
            }).exec(function(err, quotes) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the qutoes'
                    });
                }

                res.json(quotes)
            });
        },
        /**
         * List of Quotes
         */
        all: function(req, res) {
            Quote.find({}).sort('-qdate').exec(function(err, quote) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the quotes'
                    });
                }

                res.json(quote)
            });
        },
        quotes_by_symbol: function (req, res, next){
            var sym = req.query.indexsymbol;
            Quote.aggregate({
                $match:{
                    symbol:sym
                }
            }).exec(function(err, quotes){
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the qutoes'
                    });
                }
                res.json(quotes)
            });
        }
    };
}