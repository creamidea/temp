#!/usr/bin/env node

'use strict'

var util = require('util')
var child_process = require('child_process')
var spawnSync = require('child_process').spawnSync

class Deployer {
  // branch 分支的名称
  // dirname 站点（blog）的路径在哪里
  constructor() {
    if(!dirname) var dirname = __dirname
    this.root = dirname
  }

  command(c) {
    if (this.path) {
      this[c]()
    } else {
      console.log('This path MUST be here.')
    }
  }

  start() {
    // console.log(process.argv)
    var comment = process.argv[2]
    this['exec-sh'](this['push-github-master'](comment))
    this['exec-sh'](this['push-github-articles'](commnt))
  }

  'exec-sh' (sh) {
    sh.every(function(cwd) {
      if (typeof cwd === 'string' || cwd instanceof String) {
        cwd = cwd.split(' ')
      }
      console.log(`-> ${cwd.join(' ')}`);
      var rlt = spawnSync(cwd.shift(), cwd)
      if (rlt.status === null) {
        console.log(`command cannot found: ${rlt.args[0]}`)
        process.exit(1)
      }
      if (rlt.status === 0) {
        // var stdout = rlt.stdout.toString()
        // console.log(stdout)
        return true
      } else {
        if (rlt.stderr) console.log(rlt.stderr.toString())
        if (rlt.stdout) console.log(rlt.stdout.toString())
        return false
      }
    })
  }

  'push-github-articles' (comment) {
    if (!comment) var comment = "For Deploy " + (new Date())
    return [
      `cd ${this.root}`,
      `git add _articles static`,
      ['git', 'commit', '-m', `"${comment}"`],
      `git push origin articles`
    ]
  }

  'push-github-master' (comment) {
    if (!comment) var comment = "For Deploy " + (new Date())
    return [
      `cd ${this.root}/public`,
      `git add .`,
      ['git', 'commit', '-m', `"${comment}"`],
      `git push origin master`
    ]
  }

}

(function() {
  'use strict'
  // console.log = function () {}
  var d = new Deployer
  d.start()
})()
