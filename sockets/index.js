const sio = require('socket.io');
const ObjectId = require('mongodb').ObjectID;

let io = null;

const auth = 'Grzegorz';
const _id = '5af9f1ea790b260380da5e0e'

exports.io = () => io;

exports.init = (server, dbs) => {
  io = sio(server);

  // var nsp = io.of('/5aff33da1b3b3e2b2cc03aa7');
  // nsp.on('connection', function(socket){
  //   console.log('someone connected');
  //   socket.on('get-poll', data => {
  //     if (ObjectId.isValid(data)) {
  //       dbs.collection('polls').findOne({ _id: ObjectId(data) })
  //         .catch(err => console.log('GET POLL ERROR', err))
  //         .then(poll => {
  //           // socket.join(data);
  //           io.emit('poll', poll)
  //           // io.to(data).emit('poll', poll)
  //         })
  //     }
  //   })
  // });

  io.on('connection', socket => {
      console.log('SOCKET CONNECTED');

      socket.on('add-new-poll', data => {
        data.author = auth;
        data.user_id = ObjectId(_id);
        data.sum = 0;
        data.fields = data.fields.map(f => ({name: f.name, votes: 0}));
        dbs.collection('polls').insert(data)
        .catch(err => {
          console.log('DBS INSERT ERROR: ', err);
          socket.emit('new-poll-added', {
            error: 'Database connection error'
          });
        })
        .then(res => {
          setTimeout(() => {
            // const {author, sum, fields, title, _id} = res.ops[0];
            // socket.emit('new-poll-added', {author, sum, fields, title, url: _id})
            socket.emit('new-poll-added', res.ops[0]._id);
            console.log('NEW POLL ADDED');
          }, 1000);
        })
        // socket.broadcast.emit('poll', { poll: 'poll' });
      });
    
      socket.on('add-new-user', data => {
        dbs.collection('users').insert(data)
        .catch(err => {
          console.log('DBS ADD NEW USER ERROR: ', err);
          socket.emit('new-user-added', {
            error: 'Database add user error'
          });
        })
        .then(res => {
          setTimeout(() => socket.emit('new-user-added', res), 1000);
        })
      });

      socket.on('get_user_polls', data => {
        dbs.collection('users').aggregate([
          {
            $lookup: 
            {
                from: 'polls',
                localField: '_id',
                foreignField: 'user_id',
                as: 'user_polls'
            }
          },
          { $match: { _id: ObjectId(_id) }}
        ])
        .next((err, result) => {
          if (err) throw err;
          setTimeout(() => socket.emit('user_polls', result), 1000);
        });
      })

      // socket.on('get-poll', data => {
      //   if (ObjectId.isValid(data)) {
      //     dbs.collection('polls').findOne({ _id: ObjectId(data) })
      //       .catch(err => console.log('GET POLL ERROR', err))
      //       .then(poll => {
      //         // socket.join(data);
      //         // io.to(data).emit('poll', poll)
      //         // io.emit('poll', poll)
      //         const nsp = io.of(data);
      //         nsp.on('connection', () => {
      //           // socket.emit(data, poll)
      //           console.log('someone connected');
      //         })
      //         io.emit(data, poll)
      //       })
      //   }
      // })

      socket.on('connect to poll', room => {
        if (ObjectId.isValid(room)) {
          dbs.collection('polls').findOne({ _id: ObjectId(room) })
            .catch(err => console.log('GET POLL ERROR', err))
            .then(poll => {
              if (!poll) {
                console.log('POLL NOT EXIST');
                return socket.emit('poll not exist', 'Poll not exist in database');
              }
              // socket.emit('poll', poll)
              console.log('JOINED ROOM : ', poll._id);
              socket.join(room);
              // io.to(room).emit('poll', poll);
              // io.to(data).emit('poll', poll)
              socket.emit('connected to poll', poll)
              // io.emit('poll', poll)
              // io.emit(data, poll)
            })
        } else {
          console.log('POLL NOT EXIST');
          return socket.emit('poll not exist', 'Poll not exist in database');
        }
      });

      socket.on('disconnect from poll', room => {
        console.log('DISCONNECTED FROM ', room);
        socket.leave(room)
      });
  })
}

// For use in consumers
// const socket = require('../io').io();

// {
//   $lookup:
//     {
//       from: <collection to join>,
//       localField: <field from the input documents>,
//       foreignField: <field from the documents of the "from" collection>,
//       as: <output array field>
//     }
// }
