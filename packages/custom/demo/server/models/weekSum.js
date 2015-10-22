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
var WeekSumSchema = new Schema({
  week_start_date:{
    type: Date,
    required : true
  },
  week_end_date:{
    type: Date,
    required : true
  },
  bcom_indices:{
    type: Array,
    required : true
  },
  bcom_max:{
    type: Number,
    required : true
  },
  bcom_min:{
    type: Number,
    required : true
  },
  bcom_avg_slope:{
    type: Number,
    required : true
  },
  bcom_week_momentum:{
    /**
     * M = V - Vx
     V is the latest price, and Vx is the closing price x number of days ago."
     */
    type: Number,
    required : true
  },
  bcom_week_rsi:{
    /**
     * RSI = 100 – 100/(1+RS)

     RS= the average of x up days closes (AU)/the average of x down day closes (AD).

     AU= sum of previous x days up closes value (SU)/x

     AD= sum of previous x days down closes value (SD)/x

     X normally is set to a 14 period but users can most often edit this is charting software.

     An up day value is calculated as follows:

     Current close – previous close= up day value

     down day value is assigned as 0 on an up day

     A down day value is calculated as follows:

     previous close –  current close = down day value

     up day value is assigned as 0 on a down day
     */
    type: Number,
    required : true
  },
  bcom_volume:{
    type: Number,
    required: true
  },
  articles:{
    type: Array
  },
  sum_article_sentiment:{
    type: Number
  }
});

/**
 * Validations
 */



/**
 * Statics
 */
WeekSumSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).exec(cb);
};

mongoose.model('WeekSum', WeekSumSchema);
