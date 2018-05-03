const sio = require('socket.io');
let io = null;

exports.io = () => io;

exports.init = server => {
  io = sio(server);

  io.on('connection', socket => {
    socket.emit('news', { hello: 'world'});
    socket.on('event', data => {
      console.log(data);
      // socket.broadcast.emit('poll', { poll: 'poll' });
      // io.sockets.emit('poll', { poll: 'poll' });
      io.emit('poll', { poll: 'poll' });
    });
  })
}

// For use in consumers
// const socket = require('../io').io();
