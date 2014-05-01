'use strict';

var htmlparser2 = require('htmlparser2');

var stack = [];
var splicePos = 0;
var needSplice = false;
var listStack = [];
var trimNL = false;
var inPre = false;
var ignoreClose = false;

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
    close: '\n\n'
  },
  code: {
    open: '\n\n```\n',
    close: '\n```\n\n'
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
    open: '1.',
    close: '\n'
  },
  ulli: {
    open: '*',
    close: '\n'
  },
  hr: {
    open: '\n\n- - -\n\n',
    close: ''
  },
  h1: {
    open: '# ',
    close: '\n\n'
  },
  h2: {
    open: '## ',
    close: '\n\n'
  },
  h3: {
    open: '### ',
    close: '\n\n'
  },
  h4: {
    open: '#### ',
    close: '\n\n'
  },
  h5: {
    open: '##### ',
    close: '\n\n'
  },
  h6: {
    open: '###### ',
    close: '\n\n'
  }
};


function onopentag(name, attrs){
  if(name === 'ol' || name === 'ul'){
    listStack.push(name);
  }

  if(name === 'pre'){
    inPre = true;
  }

  if(name === 'code' && inPre){
    stack.pop();
  }

  if(name === 'li'){
    trimNL = true;
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
    if(trimNL){
      text = text.trim();
    }
    stack.push(text);
  }
}

function onclosetag(name){
  if(name === 'ol' || name === 'ul'){
    listStack.pop();
  }

  if(name === 'li'){
    trimNL = false;
    name = listStack.slice(-1)[0]+'li';
  }

  if(name === 'pre'){
    inPre = false;
  }

  if(name === 'code' && inPre){
    ignoreClose = true;
  }

  var tag = tagTable[name];
  if(tag && !ignoreClose){
    stack.push(tag.close);
  }

  if(ignoreClose){
    ignoreClose = false;
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