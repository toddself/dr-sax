'use strict';

var test = require('tap').test;
var drsax = require('../index');

test('bolding', function(t){
  var output = drsax('<b>this is a test</b>');
  t.equal(output, '**this is a test**', 'bolding');
  t.end();
});

test('italics', function(t){
  var output = drsax('<i>this is a test</i>');
  t.equal(output, '*this is a test*', 'italics');
  t.end();
});

test('anchors', function(t){
  var output = drsax('<a href="http://example.org">this is a test</a>');
  t.equal(output, '[this is a test](http://example.org)', 'anchors');
  t.end();
});

test('images', function(t){
  var output = drsax('<img src="http://example.org/test.gif" alt="I am a little teapot">');
  t.equal(output, '![I am a little teapot](http://example.org/test.gif)', 'images');
  t.end();
});

test('ordered lists', function(t){
  var output = drsax('<ol><li> this is the first <li> this is the second</ol>');
  t.equal(output, '\n\n1.this is the first\n1.this is the second\n\n\n', 'ordered lists');
  t.end();
});

test('unordered lists', function(t){
  var output = drsax('<ul><li> this is the first <li> this is the second</ul>');
  t.equal(output, '\n\n*this is the first\n*this is the second\n\n\n', 'ordered lists');
  t.end();
});

test('pre', function(t){
  var output = drsax('<pre>i am a robot</pre>');
  t.equal(output, '`i am a robot`', 'pre');
  t.end();
});

test('blockquote', function(t){
  var output = drsax('<blockquote>I am a little teapot short and stout</blockquote>');
  t.equal(output, '\n\n> I am a little teapot short and stout\n\n', 'blockquote');
  t.end();
});

test('code', function(t){
  var output = drsax('<code>size_t strcspn(const char[]* str, const char[]* del)</code>');
  t.equal(output, '\n\n```\nsize_t strcspn(const char[]* str, const char[]* del)\n```\n\n', 'code');
  t.end();
});

test('p', function(t){
  var output = drsax('<p>this is a test</p>');
  t.equal(output, 'this is a test\n\n', 'p');
  t.end();
});

test('hr', function(t){
  var output = drsax('<hr>');
  t.equal(output, '\n\n- - -\n\n', 'hr');
  t.end();
});

test('headers', function(t){
  var output = drsax('<h1>test</h1><h2>test</h2><h3>test</h3><h4>test</h4><h5>test</h5><h6>test</h6>');
  t.equal(output, '# test\n\n## test\n\n### test\n\n#### test\n\n##### test\n\n###### test\n\n', 'headers');
  t.end();
});