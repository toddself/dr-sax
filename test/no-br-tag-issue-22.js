'use strict';

var test = require('tap').test;
var DrSax = require('../index');

test('non-indented block level elements should have no leading whitespace', function(t){
  var drsax = new DrSax();
  var output = drsax.write('This should have<br>\n<br>\na few line breaks');
  t.ok(output.match(/\n\n/), 'line breaks');
  t.end();
});
