'use strict'

var child_process = require('child_process')

var app = require('koa')()
var router = require('koa-router')()
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({
  port: 3001
})

/*
 * 发布
 */
router.get('/publish', function() {
  var child1 = child_process.fork(__dirname + '/deploy.js', ['articles', '_articles _draft static README.org favicon.ico bin.js deploy.js', process.argv[2]])
  var child2 = child_process.fork(__dirname + '/deploy.js', ['master', '.', process.argv[2]])
  this.body = '<p style="text-align: center; font-size: 4em;">The server is publish...<p>'
})

app.use(function*(next) {
    // console.log(this)
    yield next

    var body = this.body
    var type = this.type
    if (type === 'html' || type === 'text/html') {
      // 截获koa-static处理的html文件，插入自己想要的东西，然后返回
      var html = ""
      body.on('data', function(chunk) {
        // console.log(chunk.toString());
        html = chunk.toString()
        html = html.slice(0, -8) + '<link rel="stylesheet" type="text/css" href="publish.css"><script src="publish.js"></script></html>'
      })
      yield body.on.bind(body, 'end') // TODO: 理解这里的意思 http://stackoverflow.com/a/23853606/1925954
      this.body = html
    }
  })
  .use(require('koa-static')(__dirname + '/public'), {
    defer: true
  })
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    message = JSON.parse(message)
    console.log('Received: ', message)

    // TODO: 后面如果要做扩展的时候在搞
    if (message.command === 'publish') {
      var child1 = child_process.fork(__dirname + '/deploy.js', ['articles', '_articles _draft static README.org favicon.ico bin.js deploy.js', message.argv[0]])
      var child2 = child_process.fork(__dirname + '/deploy.js', ['master', '.', message.argv[0]])
      child1.on('message', function (message) {
        // console.log('=========', message)
        ws.send(JSON.stringify(message))
      })
      child2.on('message', function (message) {
        ws.send(JSON.stringify(message))
      })
    }

  })
})
console.log('listening on port 3000')
console.log('websocket server listening on port 3001')
