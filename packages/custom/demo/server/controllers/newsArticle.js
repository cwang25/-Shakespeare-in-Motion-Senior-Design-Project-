'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    NewsArticle = mongoose.model('NewsArticle'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Articles) {

    return {
        /**
         * Find article by id
         */
        newsarticle: function(req, res, next, id) {
            NewsArticle.load(id, function(err, newsarticle) {
                if (err) return next(err);
                if (!newsarticle) return next(new Error('Failed to load article ' + id));
                req.newsarticle = newsarticle;
                next();
            });
        },

        savedummy: function(req, res){
            var news = new NewsArticle({title : 'DummyTitle3',content : 'DummyContent3' });
            news.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the article'
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

                res.json(news);
            });
        },
        /**
         * Create an article
         */
        create: function(req, res) {
            var article = new NewsArticle(req.body);
            article.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the article',
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

                res.json(article);
            });
        },
        /**
         * Update an article
         */
        update: function(req, res) {
            var article = req.newsarticle;

            article = _.extend(article, req.body);


            article.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot update the article'
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

                res.json(article);
            });
        },
        /**
         * Delete an article
         */
        destroy: function(req, res) {
            var article = req.newsarticle;


            article.remove(function(err) {
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

                res.json(article);
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

            res.json(req.newsarticle);
        },
        newsintimerange: function(req, res, next){
            var date1 = Date.parse(req.query.startdate);
            var date2 = Date.parse(req.query.enddate);
            NewsArticle.find({
                newsDate: {
                    $gte: date1,
                    $lte: date2
                }
            }).exec(function(err, newsarticles) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }

                res.json(newsarticles)
            });
        },
        /**
         * List of Articles
         */
        all: function(req, res) {
            NewsArticle.find().exec(function(err, newsarticles) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the articles'
                    });
                }

                res.json(newsarticles)
            });

        }
    };
}