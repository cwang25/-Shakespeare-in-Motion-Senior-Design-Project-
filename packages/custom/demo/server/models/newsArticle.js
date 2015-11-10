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
    type: Array,
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

NewsArticleSchema.pre("save",function(next){
  var self = this;
  mongoose.models["NewsArticle"].findOne({
    title: self.title,
    content: self.content
  },function(err, news){
    if(err){
      next(err);
    }else if(news){
      console.log("There is no two identicle articles allowed");
      console.log(self);
      console.log(news);
      self.invalidate("title","There is no two identicle articles allowed");
      next(new Error("Article mush be unique"));
    }else{
      next();
    }
  });
});
/**
 * Statics
 */
NewsArticleSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('NewsArticle', NewsArticleSchema);
