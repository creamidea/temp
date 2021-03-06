#!/usr/bin/env node

/*
 * 这个是部署脚本，并不用于解决冲突。
 * 一般情况下，public中的文件是全量同步的，并不会有冲突
 * 而_articles中的文件是有可能冲突的，当冲突发生时，需要人工手动解决。
 */

'use strict'
var spawnSync = require('child_process').spawnSync


class Deployer {
  // branch 分支的名称
  // dirname 站点（blog）的路径在哪里
  constructor() {
    if (!dirname) var dirname = __dirname
    this.root = dirname
  }

  start() {
    // console.log(process.argv)
    var comment = process.argv[2]
    var branch = process.argv[3]
    var files = process.argv[4]
    this['exec-sh'](this['git-add-commit-push'](branch, files, comment))
  }

  'exec-sh' (sh) {
    var dirname = sh.shift()
    sh.every(function(cwd) {
      process.chdir(dirname)
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
        var stdout = rlt.stdout.toString()
        console.log(stdout)
        return true
      } else {
        if (rlt.stderr) console.log(rlt.stderr.toString())
        if (rlt.stdout) console.log(rlt.stdout.toString())
        return false
      }
    })
  }

  'git-add-commit-push' (branch, files, comment) {
    var dirname = this.root

    if (!files || files === 'undefined') {
      console.log('git add files none.')
      process.exit(0)
    }
    if (!branch || branch === 'undefined') var branch = "master"
    if (!comment || comment === 'undefined') var comment = "For Deployment " + (new Date())
    if (branch === 'master') dirname = this.root + '/public'

    return [
      dirname,
      // 'git status',
      // `git checkout ${branch}`,
      // `git add _articles static deploy.js README.org _draft favicon.ico`, // TODO: here will be contain deploy.js
      `git add ${files}`, // TODO: here will be contain deploy.js
      ['git', 'commit', '-m', comment],
      `git push origin ${branch}:${branch}`
    ]
  }
}

(function() {
  var d = new Deployer
  d.start()
})()
