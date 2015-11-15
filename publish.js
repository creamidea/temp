'use strict'

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
}

document.addEventListener('DOMContentLoaded', function() {


  var pathname = window.location.pathname
  var body = document.getElementsByTagName('body')[0]
  var content = document.getElementById('content')
  var meta = getMetaInfo(true)
  var isHome = false
  var ws, oldSend

  if (window.location.pathname === '/') isHome = true

  if (!WebSocket) {
    body.innerText = 'Please use chrome or other\'s bowser which support WebSocket Interface.'
    return
  }

  if (!isHome) {
    ws = new WebSocket('ws://' + window.location.hostname + ':3001')
    oldSend = ws.send

    /**
    * Send function
    */
    ws.send = function(message) {
      if (typeof message === 'string' || message instanceof String) {

      } else {
        message = JSON.stringify(message)
      }
      return oldSend.apply(ws, [message])
    }

    ws.onopen = function(event) {

    }

    ws.onclose = function() {
      body.innerHTML = '<h1>WebSocket Disconnected!</h1>'
    }

    ws.onmessage = function(message) {
      var data = JSON.parse(message.data)
      console.log(data.hint)
    }

    addPublishBtn(body, content, ws)
  }

})
