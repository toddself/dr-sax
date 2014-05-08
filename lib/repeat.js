'use strict';

/**
 * Return a string with the input repeated itr number of times
 * @method  repeat
 * @private
 * @param   {string} chr the string to repeat
 * @param   {number} itr the number of times to repeat it
 * @returns {string} the string repeated itr times
 */
module.exports = function repeat(chr, itr){
  return new Array(itr+1).join(chr || '');
};