'use strict';

var DrSax = require('./lib/drsax');
var StreamingInterface = require('./lib/stream');

// add in streaming
DrSax.stream = function(options){
  return new StreamingInterface(options);
};

module.exports = DrSax;