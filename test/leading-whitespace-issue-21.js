'use strict';

var test = require('tap').test;
var DrSax = require('../index');

test('non-indented block level elements should have no leading whitespace', function(t){
  var drsax = new DrSax();
  var output = drsax.write('doo doo <h2>i should have no leading space</h2> this is a test');
  output.split('\n').forEach(function(line){
    console.log(line);
    t.equal(line.match(/^\s<h2>/), null, 'no leading whitespace prior to block level element');
  });
  t.end();
});
