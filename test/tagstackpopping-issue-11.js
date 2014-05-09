'use strict';

var test = require('tap').test;
var DrSax = require('../index');

test('tag stack pops correctly', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<a href="http://test.com"><b>test</a></b>');
  t.equal(output, '[**test**](http://test.com)', 'tag stack popping works correctly');
  t.end();
});

