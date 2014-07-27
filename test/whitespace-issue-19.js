'use strict';

var test = require('tap').test;
var DrSax = require('../index');

test('should keep meaningful whitespace', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<li><b>this is a test</b> of whitespace issues</li>');
  t.ok(output.match(/test\*\*\ of/), 'spaces are preserved');
  t.end();
});
