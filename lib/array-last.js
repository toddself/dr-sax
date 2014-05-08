'use strict';

/**
 * Get the last element of an array
 * @method  last
 * @param   {array} arr Array to slice and dice
 * @returns {mixed} last element of the array
 */
module.exports = function last(arr){
  return arr.slice(-1)[0];
};
