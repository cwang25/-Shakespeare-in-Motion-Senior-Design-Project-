'use strict';

/**
 * Module dependencies.
 * Author: Chi-Han Wang
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
  },
  url: {
    type: String,
    required: false,
    trim: true
  },
  keywords:{
    type: String,
    required: false
  },
  entities:{
    type: Array,
    required: false
  },
  sentiment:{
    type: Number,
    required: false
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

NewsArticleSchema.path('newsDate').validate(function(newsDate) {
  return !!newsDate;
}, '1------');

NewsArticleSchema.path('keywords').validate(function(keywords) {
  return !!keywords;
}, '2-------');

NewsArticleSchema.path('entities').validate(function(entities) {
  return !!entities;
}, '3-------');
NewsArticleSchema.path('sentiment').validate(function(sentiment) {
  return !!sentiment;
}, '3-------');
NewsArticleSchema.path('url').validate(function(url) {
  return !!url;
}, '56456-------');
/**
 * Statics
 */
NewsArticleSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('NewsArticle', NewsArticleSchema);
