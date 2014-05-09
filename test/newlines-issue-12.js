'use strict';

var test = require('tap').test;
var DrSax = require('../index');

test('should never be four newlines in a row', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<p>this is a test<p>of newline issues');
  t.equal(output.match(/\n\n\n\n/), null, 'block level elements generate correct line spacing');
  t.end();
});
