'use strict';

/**
 * Get the last element of an array
 * @method  last
 * @param   {array} arr Array to slice and dice
 * @param   {number} num The number of elements of the array to return starting from the right
 * @returns {mixed} last element of the array
 */
module.exports = function last(arr, num){
  num = num || 1;
  var slice =  arr.slice(num*-1);
  if(num === 1){
    return slice[0];
  } else {
    return slice;
  }
};
