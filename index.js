'use strict';

var DrSax = require('./lib/drsax');
var StreamingInterface = require('./lib/stream');

DrSax.stream = function(options){
  return new StreamingInterface(options);
};

module.exports = DrSax;