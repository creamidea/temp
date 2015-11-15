#!/usr/bin/env node

'use strict'

var child_process = require('child_process')
var child1, child2

if (process.argv.length > 3) {
  console.log('COMMAND error! The comment must be wrapped by ""');
  console.log('e.g. $ node deploy.js "The comment you want to input."');
  process.exit(0)
} else {
  child1 = child_process.fork(__dirname + '/deploy.js', [process.argv[2], 'articles', '_articles static deploy.js README.org _draft favicon.ico'])
  child2 = child_process.fork(__dirname + '/deploy.js', [process.argv[2], 'master', '.'])
  child1.on('exit', function() {
    // console.log(arguments, this);
  })
  child2.on('exit', function() {

  })
}
