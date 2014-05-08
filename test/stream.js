'use strict';

var util = require('util');
var test = require('tap').test;
var DrSax = require('../index');
var rs = require('readable-stream');

var Output = function(){
  this.string = '';
  rs.Writable.call(this);
};
util.inherits(Output, rs.Writable);

Output.prototype._write = function(chunk, enc, cb){
  this.string += chunk.toString();
  cb();
};

test('streaming interface', function(t){
  var out = new Output();
  var transform = DrSax.stream();
  transform.pipe(out);
  transform.write('<b>test</b>');
  transform.end();
  transform.on('end', function(){
    t.equal(out.string, '**test**', 'streaming interface');
    t.end();
  });
});