'use strict';

var test = require('tap').test;
var DrSax = require('../index');

test('nested anchor tags should function correctly', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<a href="http://test.com"><b>testing</b></a>');
  t.equal(output, '[**testing**](http://test.com)', 'nesting spliced tags');
  t.end();
});
