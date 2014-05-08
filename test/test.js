'use strict';

var test = require('tap').test;
var DrSax = require('../index');

test('bolding', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<b>this is a test</b>');
  t.equal(output, '**this is a test**', 'bolding');
  t.end();
});

test('italics', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<i>this is a test</i>');
  t.equal(output, '_this is a test_', 'italics');
  t.end();
});

test('anchors', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<a href="http://example.org">this is a test</a>');
  t.equal(output, '[this is a test](http://example.org)', 'anchors');
  t.end();
});

test('images', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<img src="http://example.org/test.gif" alt="I am a little teapot">');
  t.equal(output, '![I am a little teapot](http://example.org/test.gif)', 'images');
  t.end();
});

test('ordered lists', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<ol><li> this is the first <li> this is the second</ol>');
  t.equal(output, '\n\n1. this is the first\n1. this is the second\n\n\n', 'ordered lists');
  t.end();
});

test('unordered lists', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<ul><li> this is the first <li> this is the second</ul>');
  t.equal(output, '\n\n* this is the first\n* this is the second\n\n\n', 'ordered lists');
  t.end();
});

test('pre', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<pre>i am a robot</pre>');
  t.equal(output, '`i am a robot`', 'pre');
  t.end();
});

test('blockquote', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<blockquote>I am a little teapot short and stout</blockquote>');
  t.equal(output, '\n\n> I am a little teapot short and stout\n\n', 'blockquote');
  t.end();
});

test('code', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<code>size_t strcspn(const char[]* str, const char[]* del)</code>');
  t.equal(output, '\n\n```\nsize_t strcspn(const char[]* str, const char[]* del)\n```\n\n', 'code');
  t.end();
});

test('p', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<p>this is a test</p>');
  t.equal(output, '\n\nthis is a test\n\n', 'p');
  t.end();
});

test('hr', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<hr>');
  t.equal(output, '\n\n- - -\n\n', 'hr');
  t.end();
});

test('headers', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<h1>test</h1><h2>test</h2><h3>test</h3><h4>test</h4><h5>test</h5><h6>test</h6>');
  t.equal(output, '# test\n## test\n### test\n#### test\n##### test\n###### test\n', 'headers');
  t.end();
});

test('indenting', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<blockquote>this is a <blockquote>test man</blockquote>you are just a test</blockquote>');
  t.equal(output, '\n\n> this is a \n> > test man\n> you are just a test\n\n', 'indenting for block level tags');
  t.end();
});

test('strip tags on', function(t){
  var drsax = new DrSax({stripTags: true});
  var output = drsax.write('<b>This is a test <span class="foo">of stripping unknown tags</span></b>');
  t.equal(output, '**This is a test of stripping unknown tags**', 'stripping tags');
  t.end();
});

test('strip tags off', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<b>This is a test <span class="foo">of stripping unknown tags</span></b>');
  t.equal(output, '**This is a test <span class="foo">of stripping unknown tags</span>**', 'leaving in tags');
  t.end();
});

test('unclosed html', function(t){
  var drsax = new DrSax();
  var output = drsax.write('<b>this is a test <i>with unclosed tags');
  t.equal(output, '**this is a test _with unclosed tags_**');
  t.end();
});
