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
  return this.prepare(srcDir, destDir).then(function(spawnOptions) {
    return self.execute(srcDir, destDir, spawnOptions);
  })
}

Exec.prototype.execute = function (srcDir, destDir, spawnOptions) {
  var self = this;

  return new Promise(function (resolve, reject) {
    if (!spawnOptions.command) {
      reject('Must specify command to execute in options.command');
      return;
    }

    var proc = childProcess.spawn(spawnOptions.command, spawnOptions.args, spawnOptions.options);

    proc.on('error', function(err) {
      reject(new Error('Error spawning command "' + self.command + '": ' + err));
    });

    proc.on('exit', function(code, signal) {
      self.interpretExitCode(code, signal, resolve, reject);
    });

    proc.stdout.on('data', function(data) {
      self.log('' + data);
    });

    proc.stderr.on('data', function(data) {
      self.log('' + data);
    });
  });
}

Exec.prototype.prepare = function(srcDir, destDir) {
  var self = this;

  return new Promise(function (resolve, reject) {
    var args = self.replaceDestDirInArguments(self.args, destDir);
    var options = {
      cwd: srcDir
    };

    resolve({
      command: self.command,
      args: args,
      options: options
    });
  });
}

Exec.prototype.log = function (data) {
  console.log('' + data);
}

Exec.prototype.interpretExitCode = function(code, signal, resolve, reject) {
  if (code === 0) {
    resolve();
  } else {
    reject(new Error(this.command + ' exited with code ' + code));
  }
}

Exec.prototype.replaceDestDirInArguments = function(args, destDir) {
  return args.map(function(arg) {
    return arg.replace('{destDir}', destDir);
  });
}