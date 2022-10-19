var path = require('path');
var appDir = path.dirname(require.main.filename)
const { spawn } = require('child_process');
// var ab2str = require('arraybuffer-to-string')
// var socket = require('socket.io')
// var app = require("./../app")

module.exports = function (io, options = {}) {
  var open = function (socket) {
    var ls = spawn('cmd', ['cd', appDir]);
    socket.emit('cli', 'A client connected!');
    var listener = function (data) {
      // console.log('input: '+ data);
      if (data === 'cli-kill')
        ls.kill('SIGINT');
      else
        ls.stdin.write(data + '\n');
    }
    socket.on('cli', listener);

    socket.on('disconnect', (reason) => {
      console.log('disconnecteddddd')
      socket.removeAllListeners('cli')
      ls.stdout.removeAllListeners('data')
      ls.stderr.removeAllListeners('data')
      ls.removeAllListeners('close')
    })

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      io.emit('cli', data)
    });
  
    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
      io.emit('cli', data)
    });
  
    ls.on('close', (code) => {
      socket.removeAllListeners('cli')
      ls.stdout.removeAllListeners('data')
      ls.stderr.removeAllListeners('data')
      ls.removeAllListeners('close')
      console.log(`child process exited with code ${code}`);
      open(socket)
    });
  }
  io.on('connection', function(socket) {
    open(socket)
    console.log('cli middleware is running');
  });
};
