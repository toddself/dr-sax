'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

var test = require('tap').test;
var DrSax = require('../');
var markdown = require('markdown').markdown;
var marked = require('marked');
var commonMark = require('commonMark');
var commonMarkParser = new commonMark.Parser();
var commonMarkRenderer = new commonMark.HtmlRenderer();
var markedRenderer = new marked.Renderer();
markedRenderer.heading = function(text, level){
  return '<h' + level + '>' + text + '</h' + level + '>';
};

// Since HTML output is whitespace agnostic, differences in newlines in HTML output between Marked and STMD are considered irrelevant since renders will render them identically.

var str = '<h1>Why use <a href="https://github.com/toddself/dr-sax/">Dr. Sax</a></h1>\n\n<ol><li>Becuase you like puns!</li><li>Becuase you need speed</li></ol>\n\n<p><strong>This is going to be bold!</strong></p>\n\n<h2>Kittens</h2>\n\n<p>Look at these funny little furry things!</p>\n\n<iframe width="560" height="315" src="//www.youtube.com/embed/hhKJCe-sI" frameborder="0" allowfullscreen=\"\"></iframe>';

test('goes into md and back out again', function(t){
  var drsax = new DrSax();
  var md = drsax.write(str);

  var commonMark_html = commonMarkRenderer.render(commonMarkParser.parse(md)).replace(/\n/g, '');
  var markdown_html = markdown.toHTML(md).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  var marked_html = marked(md, {renderer: markedRenderer});

  t.notEqual(str, markdown_html, 'Markdown inserts too many <p> tags');
  t.equal(str.replace(/\n/g, ''), marked_html.replace(/\n/g, ''), 'conforms to marked');
  t.equal(str.replace(/\n/g, ''), commonMark_html, 'CommonMark inserts too many <p> tags');

  if(process.env.NOGRUBER === 'true'){
    t.end();
  } else {
    var gruberExec = path.join('Markdown_1.0.1', 'Markdown.pl');
    var gruber = spawn(gruberExec, ['--html4tags']);
    var gruberHTML = '';

    gruber.stdin.write(md);
    gruber.stdin.end();

    gruber.stdout.on('data', function(data){
      gruberHTML += data.toString();
    });

    gruber.on('close', function(code){
      t.equal(code, 0, 'exited cleanly');
      t.equal(str.replace(/\n/g, ''), gruberHTML.replace(/\n/g, ''), 'Conforms to Gruber');
      t.end();
    });
  }
});
