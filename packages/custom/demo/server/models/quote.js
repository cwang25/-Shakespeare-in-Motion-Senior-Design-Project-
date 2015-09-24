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
var QuoteSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  qdate: {
    type: Date,
    required: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  close: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  adj_close: {
    type: Number,
    required: true
  }
});

/**
 * Validations
 */

QuoteSchema.pre("save",function(next){
  var self = this;
  mongoose.models["Quote"].findOne({
    symbol: self.symbol,
    qdate: self.qdate
  },function(err, quote){
    if(err){
      next(err);
    }else if(quote){
      //self.invalidate("qdate","There is no two same symbol quotes with the same date");
      next(new Error("date must be different for quote with same symbol"));
    }else{
      next();
    }
  });
  //next();
});

/**
 * Statics
 */
QuoteSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};
QuoteSchema.statics.checkDate = function(d){
  this.findOne({
    qdate: d
  }).exec(function(err, quote){
    if(err)return handleError(err);
    if(quote != undefined) return false;
    return true;
  });
};
mongoose.model('Quote', QuoteSchema);
