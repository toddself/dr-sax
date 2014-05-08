'use strict';

/**
 * Reconstruct an HTML tag for normal mode operations based on the data
 * provided by the callbacks in htmlparser2's parser.
 * @method  rebuildTag
 * @param   {string} name Tag name
 * @param   {object} [attrs] Attributes, if any, for the tag
 * @param   {string} [pos=close] Position: open or close
 * @returns {string} Rebuilt open or close tag
 */
module.exports = function rebuildTag(name, attrs, pos){
  pos = pos || attrs;
  var tag;
  var attrStr;

  if(pos === 'open'){
    attrStr = Object.keys(attrs).reduce(function(a, key) {
      a.push([key,'="', attrs[key], '"'].join(''));
      return a;
    }, []).join(' ');

    if(attrStr.length > 0){
      tag =  ['<', name, ' ', attrStr, '>'].join('');
    } else {
      tag = ['<', name, '>'].join('');
    }
    return tag;
  } else {
    return ['</', name, '>'].join('');
  }
};