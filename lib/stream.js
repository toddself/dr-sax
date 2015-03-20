'use strict';

var stream = require('readable-stream');
var util = require('util');
var DrSax = require('./drsax');

var Transform = stream.Transform;

/**
 * Wrap up the converter into a transform stream
 * @namespace StreamingDrSax
 * @param  {object} opts options for dr. sax and/or the transform stream
 */
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

/**
 * Store each chunk of data into a string so we can access it when the stream
 * is complete
 * @method  _transform
 * @memberOf StreamingDrSax
 * @private
 * @async
 * @param   {buffer} chunk a chunk of data from the stream.
 * @param   {string} enc Encoding type for the buffer, should be utf-8
 * @param   {Function} cb callback
 * @returns {object} undefined
 */
StreamingDrSax.prototype._transform = function(chunk, enc, cb){
  this._htmlString += chunk.toString();
  cb();
};

/**
 * When the stream has been fully captured, flush out with the converted
 * markdown.
 * @private
 * @async
 * @memberOf StreamingDrSax
 * @method  _flush
 * @param   {Function} cb callback
 * @returns {object} undefined
 */
StreamingDrSax.prototype._flush = function(cb){
  this.push(this.drSax.write(this._htmlString));
  cb();
};

module.exports = StreamingDrSax;
