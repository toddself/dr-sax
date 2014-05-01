'use strict';

var htmlparser2 = require('htmlparser2');

var stack = [];
var splicePos = 0;
var needSplice = false;
var listStack = [];

var tagTable = {
  b: {
    open: '**',
    close: '**'
  },
  i: {
    open: '*',
    close: '*'
  },
  img: {
    open: '!',
    close: '',
    attrs: {
      alt: {
        open: '[',
        close: ']'
      },
      src: {
        open: '(',
        close: ')'
      }
    }
  },
  a: {
    open: '',
    close: '',
    attrs: {
      text: {
        open: '[',
        close: ']'
      },
      href: {
        open: '(',
        close: ')'
      }
    }
  },
  blockquote: {
    open: '\n\n> ',
    close: ''
  },
  code: {
    open: '\n\n```\n',
    close: '```\n\n'
  },
  pre: {
    open: '`',
    close: '`'
  },
  p: {
    open: '',
    close: '\n\n'
  },
  ol: {
    open: '\n\n',
    close: '\n\n'
  },
  ul: {
    open: '\n\n',
    close: '\n\n'
  },
  olli: {
    open: '1. ',
    close: '\n'
  },
  ulli: {
    open: '* ',
    close: '\n'
  }
};


function onopentag(name, attrs){
  if(name === 'ol' || name === 'ul'){
    listStack.push(name);
  }

  if(name === 'li'){
    name = listStack.slice(-1)[0]+'li';
  }

  var tag = tagTable[name];
  if(tag){
    stack.push(tag.open);
    if(tag.attrs){
      Object.keys(tag.attrs).forEach(function(key){
        if(key === 'text'){
          stack.push(tag.attrs[key].open);
          splicePos = stack.length;
          needSplice = true;
          stack.push(tag.attrs[key].close);
        } else if (Object.keys(attrs).indexOf(key) !== -1){
          stack.push(tag.attrs[key].open);
          stack.push(attrs[key]);
          stack.push(tag.attrs[key].close);
        }
      });
    }
  }
}

function ontext(text){
  if(needSplice){
    stack.splice(splicePos, 0, text);
    needSplice = false;
  } else {
    stack.push(text);
  }
}

function onclosetag(name){
  if(name === 'ol' || name === 'ul'){
    listStack.pop();
  }

  if(name === 'li'){
    name = listStack.slice(-1)[0];
  }

  var tag = tagTable[name];
  if(tag){
    stack.push(tag.close);
  }
}

module.exports = function(html){
  var parser = new htmlparser2.Parser({
    onopentag: onopentag,
    ontext: ontext,
    onclosetag: onclosetag
  });
  parser.write(html);
  parser.end();
  var markdown = stack.join('');
  stack.length = 0;
  return markdown;
};