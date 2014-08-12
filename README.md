## broccoli-exec

A [Broccoli](https://github.com/joliss/broccoli) plugin that executes arbitrary external tools to transform a tree.

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

### License

MIT