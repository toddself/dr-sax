'use strict';

var htmlparser2 = require('htmlparser2');
var tagTable = require('./dialect');

/**
 * Get the last element of an array
 * @method  last
 * @private
 * @param   {array} arr Array to slice and dice
 * @returns {mixed} last element of the array
 */
function last(arr){
  return arr.slice(-1)[0];
}

/**
 * Return a string with the input repeated itr number of times
 * @method  repeat
 * @private
 * @param   {string} chr the string to repeat
 * @param   {number} itr the number of times to repeat it
 * @returns {string} the string repeated itr times
 */
function repeat(chr, itr){
  return new Array(itr+1).join(chr);
}

/**
 * DrSax is a SAX based HTML to Markdown converter.
 * @namespace DrSax
 * @method DrSax
 */
function DrSax(){
  this.parser = new htmlparser2.Parser({
    onopentag: this.onopentag.bind(this),
    ontext: this.ontext.bind(this),
    onclosetag: this.onclosetag.bind(this)
  });
  this.stack = [];
  this.splicePos = 0;
  this.needSplice = false;
  this.listStack = [];
  this.trimNL = false;
  this.tagStack = [];
  this.ignoreClose = false;
  this.indentStack = 0;
}

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
  var markdown = this.stack.join('');
  this.stack.length = 0; // clear the stack incase we use this again
  return markdown;
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
  // we want to trim <li> elements so they don't generate multiple lists
  // also here we will determine what actual markdown token to insert
  // based on the parent element for the <li> that we captured above
  if(name === 'li'){
    this.trimNL = true;
    name = last(this.listStack)+'li';
  }

  var tag = tagTable[name];
  if(tag){
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

    // if we are in a tag that allows tags "inside" of it, we need to maintain
    // the proper amount of indentation
    this.stack.push(repeat('\t', this.indentStack));
    if(tag.indent){
      ++this.indentStack;
    }

    this.stack.push(tag.open);
    if(tag.attrs){
      var keys = Object.keys(tag.attrs);
      var len = keys.length;
      for(var i = 0; i < len; i++){
        var key = keys[i];
        this.stack.push(tag.attrs[key].open);
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
        this.stack.push(tag.attrs[key].close);
      }
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
  if(name === 'ol' || name === 'ul'){
    this.listStack.pop();
  }

  if(name === 'li'){
    this.trimNL = false;
    name = last(this.listStack)+'li';
  }

  var tag = tagTable[name];
  if(tag && !this.ignoreClose){
    this.stack.push(tag.close);
  }

  if(this.ignoreClose){
    this.ignoreClose = false;
  }
  if(tag.indent){
    --this.indentStack;
  }
};

module.exports = DrSax;