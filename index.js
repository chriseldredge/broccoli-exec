var Writer = require('broccoli-caching-writer')
var childProcess = require('child_process')
var Promise = require('rsvp').Promise

module.exports = Exec
Exec.prototype = Object.create(Writer.prototype)
Exec.prototype.constructor = Exec
function Exec (inputTree, options) {
  if (!(this instanceof Exec)) return new Exec(inputTree, options)
  this.inputTree = inputTree;
  
  for (var prop in options) {
    this[prop] = options[prop];
  }
}

Exec.prototype.updateCache = function (srcDir, destDir) {
  var self = this;

  return new Promise(function (resolve, reject) {
    if (!self.command) {
      reject('Must specify command to execute in options.command');
      return;
    }

    var args = _replaceDestDirInArguments(self.args, destDir);
    var execOptions = {
      cwd: srcDir
    };

    var proc = childProcess.spawn(self.command, args, execOptions);

    proc.on('close', function(code) {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(self.command + ' exited with code ' + code));
      }
    });

    proc.stdout.on('data', function(data) {
      self.log('' + data);
    });

    proc.stderr.on('data', function(data) {
      self.log('' + data);
    });
  });
}

Exec.prototype.log = function (data) {
  console.log('' + data);
}

function _replaceDestDirInArguments(args, destDir) {
  return args.map(function(arg) {
    return arg.replace('{destDir}', destDir);
  });
}