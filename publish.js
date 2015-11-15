'use strict'

function Publish(body, content) {
  var btnPublish, editorContainer, ws
  ws = createWebsocket()
  ws.onopen = function(event) {

  }
  ws.onclose = function() {
    body.innerHTML = '<h1>WebSocket Disconnected!</h1>'
  }
  ws.onmessage = function(message) {
    var data = JSON.parse(message.data)
    require(['oenkace'], function(editor) {
      editor.insert(data.stdout)
      editorContainer.style.position = 'absolute'
    })
  }

  loadRequirejs(body)
  editorContainer = createEditorContainer(body)
  btnPublish = addPublishBtn(body, content, ws)

}

function createWebsocket() {
  var ws, oldSend
  ws = new WebSocket('ws://' + window.location.hostname + ':3001')
  oldSend = ws.send
  ws.send = function(message) {
    if (typeof message === 'string' || message instanceof String) {} else {
      message = JSON.stringify(message)
    }
    return oldSend.apply(ws, [message])
  }
  return ws
}

function createEditorContainer (body) {
  var div = document.createElement('div')
  div.id = 'editor'
  body.appendChild(div)
  return div
}

function addPublishBtn(body, content, ws) {
  var btn = document.createElement('button')
  btn.innerText = 'Publish'
  btn.id = 'publish'
  btn.onclick = function(e) {
    var message = {
      command: 'publish',
      argv: []
    }
    ws.send(message)
  }
  body.appendChild(btn)
  return btn
}

function loadRequirejs(body) {
  var s = document.createElement('script')
  s.src = '/requirejs/require.js'
  s.type = 'text\/javascript'
  s.onload = function(e) {
    require.config({
      // baseUrl: '/ace/lib/ace',
      paths: {
        ace: "/ace/lib/ace"
      }
    })

    define('oenkace', ['ace/ace'], function(ace, langtools) {
      var editor = ace.edit('editor')
      editor.setOptions({
        readOnly: true,
        highlightActiveLine: false,
        highlightGutterLine: false
      })
      editor.$blockScrolling = Infinity
      editor.setTheme("ace/theme/ambiance")
      editor.session.setMode("ace/mode/sh")
      return editor
    })

  }
  body.appendChild(s)
}

document.addEventListener('DOMContentLoaded', function() {

  var pathname = window.location.pathname
  var body = document.getElementsByTagName('body')[0]
  var content = document.getElementById('content')
  var meta = getMetaInfo(true)
  var isHome = false

  if (window.location.pathname === '/') isHome = true

  if (!WebSocket) {
    body.innerText = 'Please use chrome or other\'s bowser which support WebSocket Interface.'
    return
  }

  if (!isHome) {
    Publish(body, content)
  }

})
