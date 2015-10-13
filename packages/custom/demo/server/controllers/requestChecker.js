/**
 * Created by hanswang on 10/12/15.
 */
var ipaddr = require('ipaddr.js');
var _ = require('lodash');
module.exports = {
  check_local: function (req, res, next) {
    var is_local = _.isEqual(ipaddr.process(req.ip), ipaddr.process('127.0.0.1'));
    if (is_local) {
      //console.log("true");
      return true;
    } else {
      //console.log("false");
      res.send("Error! You are trying to access the private api but you are not authenticated client.");
      return false;
    }
  }
};
