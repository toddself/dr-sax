'use strict';

var test = require('tap').test;
var DrSax = require('../');
var markdown = require('markdown').markdown;
var stmd = require('stmd');
var parser = new stmd.DocParser();
var renderer = new stmd.HtmlRenderer();

// Since HTML output is whitespace agnostic, differences in newlines in HTML output between Marked and STMD are considered irrelevant since renders will render them identically.

var str = '<h1>Why use <a href="https://github.com/toddself/dr-sax/">Dr. Sax</a></h1>\n\n<ol><li>Becuase you like puns!</li><li>Becuase you need speed</li></ol>\n\n<p><strong>This is going to be bold!</strong></p>\n\n<h2>Kittens</h2>\n\n<p>Look at these funny little furry things!</p>\n\n<p><iframe width="560" height="315" src="//www.youtube.com/embed/hhKJCe-sI" frameborder="0" allowfullscreen=\"\"></iframe></p>';

test('goes into md and back out again', function(t){
	var drsax = new DrSax();
	var md = drsax.write(str);
  var stmd_html = renderer.render(parser.parse(md)).replace(/\n/g, '');
	var marked_html = markdown.toHTML(md).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
	t.equal(str, marked_html, 'confirms to marked');
  t.equal(str.replace(/\n/g, ''), stmd_html, 'conforms to standard markdown');
	t.end();
});