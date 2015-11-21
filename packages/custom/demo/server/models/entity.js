'use strict';

/**
 * Module dependencies.
 * Author: Anna Dubovitskaya
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Entity Schema
 */
var EntitySchema = new Schema({
  entityDate: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  count: {
    type: Number,
    required: true,
    trim: true
  },
  sentiment:{
    type: Number,
    required: false
  }
});

/**
 * Validations
 */
EntitySchema.path('text').validate(function(text) {
  return !!text;
}, 'Text cannot be blank');

EntitySchema.path('count').validate(function(count) {
  return !!count;
}, 'Count cannot be blank');

/**
 * Statics
 */
EntitySchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('Entity', EntitySchema);
