## broccoli-exec

A [Broccoli](https://github.com/joliss/broccoli) plugin that executes arbitrary external tools to transform a tree.

[broccoli-caching-writer](https://www.npmjs.org/package/broccoli-caching-writer) is used to avoid running the tool
unless one or more files in the source tree have changed.

### Usage

This silly example finds files in the source tree and does a word count on each file,
writing the summary into wc.txt in the output tree:

```js
var exec = require('broccoli-exec');

var execTree = exec('app', {
    command: 'sh',
    args: [
        '-c',
        'find . -type f | xargs wc -l > {destDir}/wc.txt'
    ]
});
```

### Notes

The process is started setting CWD to the source tree to make it easy to use relative paths.

Before executing the command, broccoli-exec replaces `{destDir}` with the appropriate destination
directory. You don't have to write files into `{destDir}` but if you do not the result of broccoli-exec
is an empty tree.

### Preparing to Execute

If the command to execute needs to be resolved asynchronously, this can be done by overriding the
`prepare` function which can either replace or decorate the default implementation. The function
must return a promise that resolves with a hash that contains the command to execute:

```js
{
  command: someResolvedCommand,  // required
  args: args,                    // optional
  options: options               // optional
}
```

The options property is passed to `child_process.spawn()` to set the cwd and environment.

The default implementation takes care of replaces `{destDir}` in the arguments list. You
will need to do this yourself if you decide not to delegate to the default implementation.

### Exit Code

By default broccoli-exec assumes a non-zero exit code means the tool failed and therefore fails the build.

You can override this behavior by overriding `interpretExitCode` on your instance of broccoli-exec.
Your method must call either the resolve or reject callback to continue the build process.

### License

MIT