'use strict';

var htmlparser2 = require('htmlparser2');
var tagTable = require('../dialect');

var last = require('./array-last');
var repeat = require('./repeat');
var rebuildTag = require('./rebuild-tag');

/**
 * DrSax is a SAX based HTML to Markdown converter.
 * @namespace DrSax
 * @method DrSax
 */
function DrSax(options){
  this.parser = new htmlparser2.Parser({
    onopentag: this.onopentag.bind(this),
    ontext: this.ontext.bind(this),
    onclosetag: this.onclosetag.bind(this)
  });
  this._init();
  this.options = options || {};
}

/**
 * Reset the whole system.
 * @method  _init
 * @returns {object} undefined
 */
DrSax.prototype._init = function(){
  this.stack = [];
  this.splicePos = 0;
  this.needSplice = false;
  this.listStack = [];
  this.trimNL = false;
  this.tagStack = [];
  this.ignoreClose = false;
  this.indentStack = 0;
};

/**
 * Write a string of HTML to the converter and receive a string of markdown back
 * @memberOf DrSax
 * @method  write
 * @param   {string} html A string containing HTML
 * @returns {string} Markdown!
 */
DrSax.prototype.write = function(html){
  this.parser.write(html);
  this.parser.end();
  if(this.tagStack.length > 0){
    this._closeUnclosedTags();
  }
  var markdown = this.stack.join('');
  this._init();
  return markdown;
};

DrSax.prototype._closeUnclosedTags = function(){
  var tag = this.tagStack.pop();
  while (tag){
    this.onclosetag(tag);
    tag = this.tagStack.pop();
  }
};

/**
 * What to do when you encounter an open tag
 * @memberOf DrSax
 * @method  onopentag
 * @param   {string} name The name of the tag
 * @param   {object} attrs An object with all the attrs in key/val pairs
 * @returns {object} undefined
 */
DrSax.prototype.onopentag = function(name, attrs){
  var origName = name;
  // we want to trim <li> elements so they don't generate multiple lists
  // also here we will determine what actual markdown token to insert
  // based on the parent element for the <li> that we captured above
  if(name === 'li'){
    this.trimNL = true;
    name = last(this.listStack)+'li';
  }

  this.tag = tagTable[name];
  if(this.tag){
    this.tagStack.push(name);
    // The wrapper tags for lists don't actually generate markdown,
    // but they influence the markdown that we're generating for their
    // child <li> members, so we need to know what is the parent tag for
    // our li
    if(name === 'ol' || name === 'ul'){
      this.listStack.push(name);
    }

    // since both <code> and <pre> can wrap each other for code blocks
    // we want to make sure we're getting rid of the <pre> tag that
    // was recorded
    if(name === 'code' && last(this.tagStack) === 'pre'){
      this.ignoreClose = true;
      this.stack.pop();
    }

    // Block level tags that aren't being indented need to be appropriately
    // spaced out.
    if(this.tag.block && this.indentStack < 1){
      this.stack.push('\n\n');
    }

    // if we are in a tag that allows tags "inside" of it, we need to maintain
    // the proper amount of indentation. We'll generate what the containing tag
    // wants for an index, and if there is an indent, we'll put a newline in front
    var indentText = repeat(this.tag.indent, this.indentStack);
    if(indentText.length){
      indentText = '\n'+indentText;
    }
    this.stack.push(indentText);
    if(this.tag.indent){
      ++this.indentStack;
    }

    this.stack.push(this.tag.open);
    if(this.tag.attrs){
      var keys = Object.keys(this.tag.attrs);
      var len = keys.length;
      for(var i = 0; i < len; i++){
        var key = keys[i];
        this.stack.push(this.tag.attrs[key].open);
        // if we need to get the tags containing text in here, we have to handle
        // it specially and splice it into an earlier position in the stack
        // since we don't have access to the text right now
        if(key === 'text'){
          this.splicePos = this.stack.length;
          this.needSplice = true;
        // check to make sure the markdown token needs this particular attribute
        } else if (Object.keys(attrs).indexOf(key) !== -1){
          this.stack.push(attrs[key]);
        }
        this.stack.push(this.tag.attrs[key].close);
      }
    }
  } else {
    if(!this.options.stripTags){
      this.stack.push(rebuildTag(origName, attrs, 'open'));
    }
  }
};

/**
 * We have some straight up plain text. We might have to push it into the stack
 * at a higher position though...
 * @memberOf DrSax
 * @method  ontext
 * @param   {string} text Text nodes
 * @returns {object} undefined
 */
DrSax.prototype.ontext = function(text){
  // if we are in a block level tag that is being indented and
  // the text we are about to push isn't being proceded by the
  // open tag for that block level element, add it
  if(this.tag && this.tag.block && last(this.stack) !== this.tag.open){
    this.stack.push(this.tag.open);
  }

  // if we have to insert the text lower on the stack, this flag will be set,
  // so splice and then reset the flat
  if(this.needSplice){
    this.stack.splice(this.splicePos, 0, text);
    this.needSplice = false;
  } else {
    if(this.trimNL){
      text = text.trim();
    }
    this.stack.push(text);
  }
};

/**
 * We've reached the end of our tag, so clear all state flags, pop off the stack,
 * etc
 * @memberOf DrSax
 * @method  onclosetag
 * @param   {string} name name of the tag that is closing
 * @returns {object} undefined
 */
DrSax.prototype.onclosetag = function(name){
  var origName = name;
  // undo our listStack add since we're coming out of the list
  if(name === 'ol' || name === 'ul'){
    this.listStack.pop();
  }

  // reset the parameters for the li
  if(name === 'li'){
    this.trimNL = false;
    name = last(this.listStack)+'li';
  }

  // push a close if we aren't ignoring it and we have one to push
  var tag = tagTable[name];
  if(tag){
     if(!this.ignoreClose){
       this.stack.push(tag.close);
     }
    // if we're in an indentable tag, decrement the indent since we're leaving it.
    if(tag.indent){
      --this.indentStack;
    }

    // handle spacing appropriately for nested block level tag elements.
    if(tag.block){
      if(this.indentStack < 1){
        this.stack.push('\n\n');
      } else {
        this.stack.push('\n');
      }
    }

    // pull the tag off the stack
    this.tagStack.pop();
  } else {
    if(!this.options.stripTags){
      this.stack.push(rebuildTag(origName));
    }
  }
  // always reset ignore close -- we might have wanted to ignore this one, but
  // the next one we'll have to figure out all over again
  if(this.ignoreClose){
    this.ignoreClose = false;
  }
};

module.exports = DrSax;