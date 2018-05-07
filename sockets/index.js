const sio = require('socket.io');
const initializeDatabases = require('../dbs');

let io = null;

exports.io = () => io;

exports.init = server => {
  io = sio(server);

  io.on('connection', socket => {

    initializeDatabases().then(dbs => {
      console.log('SOCKET CONNECTED');
      socket.emit('news', { hello: 'world'});
      socket.on('add-new-poll', data => {
        dbs.collection('polls').insert(data)
        .catch(err => {
          console.log('DBS INSERT ERROR: ', err);
          io.emit('new-poll-added', {
            error: 'Database connection error'
          });
        })
        .then(res => {
          io.emit('new-poll-added', res);
        })
        // socket.broadcast.emit('poll', { poll: 'poll' });
        // io.sockets.emit('poll', { poll: 'poll' });
        setTimeout(() => io.emit('new-poll-added', data), 1000);
      });
    })
  })
}

// For use in consumers
// const socket = require('../io').io();
