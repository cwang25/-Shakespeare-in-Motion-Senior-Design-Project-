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
  qsymbol: {
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
    qsymbol: self.qsymbol,
    qdate: self.qdate,
    open: self.open,
    high: self.high,
    low: self.low,
    close: self.close,
    volume: self.volume,
    adj_close: self.adj_close
  },function(err, quote){
    if(err){
      next(err);
    }else if(quote){
      console.log("There is no two same symbol quotes");
      console.log(self);
      console.log(quote);
      self.invalidate("qsymbol","There is no two same symbol quotes");
      next(new Error("date must be different for quote with same symbol"));
    }else{
      next();
    }
  });
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
    if(quote != undefined) return quote;
    return undefined;
  });
};
mongoose.model('Quote', QuoteSchema);
