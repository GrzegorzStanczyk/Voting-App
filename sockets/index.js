const sio = require('socket.io');
let io = null;

exports.io = () => io;

exports.init = server => {
  io = sio(server);

  io.on('connection', socket => {
    console.log('SOCKET CONNECTED');
    socket.emit('news', { hello: 'world'});
    socket.on('add-new-poll', data => {
      console.log(data);
      // socket.broadcast.emit('poll', { poll: 'poll' });
      // io.sockets.emit('poll', { poll: 'poll' });
      io.emit('new-poll-added', data);
    });
  })
}

// For use in consumers
// const socket = require('../io').io();
