'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * NewsArticle Schema
 */
var NewsArticleSchema = new Schema({
  newsDate: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
});

/**
 * Validations
 */
NewsArticleSchema.path('title').validate(function(title) {
  return !!title;
}, 'Title cannot be blank');

NewsArticleSchema.path('content').validate(function(content) {
  return !!content;
}, 'Content cannot be blank');

/**
 * Statics
 */
NewsArticleSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('NewsArticle', NewsArticleSchema);
