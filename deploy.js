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

  start() {
    // console.log(process.argv)
    if (process.argv.length > 3) {
      console.log('COMMAND error! The comment must be wrapped by ""');
      console.log('e.g. $ node deploy.js "The comment you want to input."');
      process.exit(0)
    }
    var comment = process.argv[2]
    var A = child_process.fork(this['exec-sh'](this['push-github-master'](comment)))
    var B = child_process.fork(this['exec-sh'](this['push-github-articles'](comment)))
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
    var branch = 'articles'
    return [
      `cd ${this.root}`,
      `git checkout ${branch}`,
      `git add _articles static`,
      ['git', 'commit', '-m', `"${comment}"`],
      `git push origin ${branch}`
    ]
  }

  'push-github-master' (comment) {
    if (!comment) var comment = "For Deploy " + (new Date())
    var branch = 'master'
    return [
      `cd ${this.root}/public`,
      `git checkout ${branch}`,
      `git add .`,
      ['git', 'commit', '-m', `"${comment}"`],
      `git push origin ${branch}`
    ]
  }

}

(function() {
  'use strict'
  // console.log = function () {}
  var d = new Deployer
  d.start()
})()
