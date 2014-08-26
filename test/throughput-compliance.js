'use strict';

var test = require('tap').test;
var DrSax = require('../');
var markdown = require('markdown').markdown;


var str = '<h1>Why use <a href="https://github.com/toddself/dr-sax/">Dr. Sax</a></h1>\n\n<ol><li>Becuase you like puns!</li><li>Becuase you need speed</li></ol>\n\n<p><strong>This is going to be bold!</strong></p>\n\n<h2>Kittens</h2>\n\n<p>Look at these funny little furry things!</p>\n\n<p><iframe width="560" height="315" src="//www.youtube.com/embed/hhKJCe-sI" frameborder="0" allowfullscreen=\"\"></iframe></p>';

test('goes into md and back out again', function(t){
	var drsax = new DrSax();
	var md = drsax.write(str);
	var html = markdown.toHTML(md).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
	t.equal(str, html, 'should come out the same as it went in');
	t.end();
});