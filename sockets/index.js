const sio = require('socket.io');

let io = null;

const auth = '';

exports.io = () => io;

exports.init = (server, dbs) => {
  io = sio(server);

  io.on('connection', socket => {

      console.log('SOCKET CONNECTED');
      socket.emit('connected', { hello: 'world'});

      socket.on('add-new-poll', data => {
        data.author = auth;
        dbs.collection('polls').insert(data)
        .catch(err => {
          console.log('DBS INSERT ERROR: ', err);
          io.emit('new-poll-added', {
            error: 'Database connection error'
          });
        })
        .then(res => {
          // io.emit('new-poll-added', res);
          setTimeout(() => io.emit('new-poll-added', data), 1000);
          // dbs.close();
        })
        // socket.broadcast.emit('poll', { poll: 'poll' });
        // io.sockets.emit('poll', { poll: 'poll' });
      });
    
      socket.on('add-new-user', data => {
        dbs.collection('users').insert(data)
        .catch(err => {
          console.log('DBS ADD NEW USER ERROR: ', err);
          io.emit('new-user-added', {
            error: 'Database add user error'
          });
        })
        .then(res => {
          setTimeout(() => io.emit('new-user-added', res), 1000);
        })
      });
  })
}

// For use in consumers
// const socket = require('../io').io();
