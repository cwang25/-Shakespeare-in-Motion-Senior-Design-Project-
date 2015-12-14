'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Entity = mongoose.model('Entity'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');
var rqChecker = require('./requestChecker');

module.exports = function(Entities) {

    return {
        /**
         * Find entity by id
         */
        entity: function(req, res, next, id) {
            Entity.load(id, function(err, entity) {
                if (err) return next(err);
                if (!entity) return next(new Error('Failed to load entity ' + id));
                req.entity = entity;
                next();
            });
        },
        /**
         * Create an entity
         */
        create: function(req, res, next) {
            if(rqChecker.check_local(req, res)){
                var one_entity = new Entity(req.body);
                //console.log(entity);
                one_entity.save(function(err) {
                    if (err) {
                        console.log("Failed to store data: "+one_entity);
                        return res.status(500).json({
                            error: 'Cannot save the entity',
                            message: req.body
                        });
                    }

                    //entitys.events.publish({
                    //    action: 'created',
                    //    user: {
                    //        name: req.user.name
                    //    },
                    //    url: config.hostname + '/entitys/' + entity._id,
                    //    name: entity.title
                    //});

                    res.json(one_entity);
                    if(typeof next === 'function') {
                        next();
                    }
                });
            }
        },
        /**
         * Update an entity
         */
        update: function(req, res, next) {
            if(rqChecker.check_local(req, res)){
                var one_entity = req.entity;
                one_entity = _.extend(one_entity, req.body);
                one_entity.save(function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot update the entity'
                        });
                    }
                    //entitys.events.publish({
                    //    action: 'updated',
                    //    user: {
                    //        name: req.user.name
                    //    },
                    //    name: entity.title,
                    //    url: config.hostname + '/entitys/' + entity._id
                    //});
                    res.json(one_entity);
                    if(typeof next === 'function') {
                        next();
                    }
                });
            }
        },
        /**
         * Delete an entity
         */
        destroy: function(req, res, next) {
            if(rqChecker.check_local(req, res)){
                var one_entity = req.entity;
                one_entity.remove(function(err) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Cannot delete the entity'
                        });
                    }
                    //entitys.events.publish({
                    //    action: 'deleted',
                    //    user: {
                    //        name: req.user.name
                    //    },
                    //    name: entity.title
                    //});
                    res.json(one_entity);
                    if(typeof next === 'function') {
                        next();
                    }
                });
            }
        },
        /**
         * Show an entity
         */
        show: function(req, res) {
            //entitys.events.publish({
            //    action: 'viewed',
            //    user: {
            //        name: req.user.name
            //    },
            //    name: req.entity.title,
            //    url: config.hostname + '/entitys/' + req.entity._id
            //});
            res.json(req.entity);
        },
        entitiesintimerange: function(req, res, next){
            var date1 = Date.parse(req.query.startdate);
            var date2 = Date.parse(req.query.enddate);
            Entity.find({
                entityDate: {
                    $gte: date1,
                    $lte: date2
                }
            }).exec(function(err, all_entities) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the entity'
                    });
                }

                res.json(all_entities);
                if(typeof next === 'function') {
                    next();
                }
            });
        },
        /**
         * List of entities
         */
        all: function(req, res, next ) {
            Entity.find().exec(function(err, all_entities) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot list the entity'
                    });
                }
                res.json(all_entities);
                if(typeof next === 'function') {
                    next();
                }
            });

        }
    };
}