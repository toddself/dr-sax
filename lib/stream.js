'use strict';

var stream = require('readable-stream');
var util = require('util');
var DrSax = require('./drsax');

var Transform = stream.Transform;

function StreamingDrSax(opts){
  if(!(this instanceof StreamingDrSax)){
    return new StreamingDrSax(opts);
  }

  opts = opts || {};

  Transform.call(this, opts);
  this._htmlString = '';
  this.drSax = new DrSax(opts);
}

util.inherits(StreamingDrSax, Transform);

StreamingDrSax.prototype._transform = function(chunk, enc, cb){
  this._htmlString += chunk.toString();
  cb();
};

StreamingDrSax.prototype._flush = function(cb){
  this.push(this.drSax.write(this._htmlString));
  cb();
};

module.exports = StreamingDrSax;