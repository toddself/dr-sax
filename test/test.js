'use strict';

var test = require('tap').test;
var html2markdown = require('../index');

test('bolding', function(t){
  var output = html2markdown('<b>this is a test</b>');
  t.equal(output, '**this is a test**', 'bolding');
  t.end();
});

test('italics', function(t){
  var output = html2markdown('<i>this is a test</i>');
  t.equal(output, '*this is a test*', 'italics');
  t.end();
});

test('anchors', function(t){
  var output = html2markdown('<a href="http://example.org">this is a test</a>');
  t.equal(output, '[this is a test](http://example.org)');
  t.end();
});

