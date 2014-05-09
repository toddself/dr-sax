'use strict';

var test = require('tap').test;
var DrSax = require('../index');

var dialect = {
  b: {
    open: 'FOO',
    close: 'BAR'
  }
};

test('loadable dialects', function(t){
  var drsax = new DrSax({dialect: dialect});
  var output = drsax.write('<b>test</b>');
  t.equal(output, 'FOOtestBAR', 'pluggable dialect');
  t.end();
});

