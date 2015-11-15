'use strict'

var child_process = require('child_process')

var app = require('koa')()
var router = require('koa-router')()

/*
 * 发布
 */
router.get('/publish', function() {
  var child1 = child_process.fork(__dirname + '/deploy.js', ['articles', '_articles _draft static README.org favicon.ico bin.js deploy.js', process.argv[2]])
  var child2 = child_process.fork(__dirname + '/deploy.js', ['master', '.', process.argv[2]])
  this.body = 'success'
})

app.use(require('koa-static')(__dirname + '/public'))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
console.log('listening on port 3000')
