#!/usr/bin/env node

'use strict'

var child_process = require('child_process')
var child1 = child_process.fork(__dirname + '/deploy.js', [process.argv[2], 'articles'])
var child2 = child_process.fork(__dirname + '/deploy.js', [process.argv[2], 'master'])
child1.on('exit', function () {
  // console.log(arguments, this);
})
child2.on('exit', function () {

})
