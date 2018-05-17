const sio = require('socket.io');
const ObjectId = require('mongodb').ObjectID;

let io = null;

const auth = 'Grzegorz';
const _id = '5af9f1ea790b260380da5e0e'

exports.io = () => io;

exports.init = (server, dbs) => {
  io = sio(server);

  io.on('connection', socket => {

      console.log('SOCKET CONNECTED');
      socket.emit('connected', { hello: 'world'});

      socket.on('add-new-poll', data => {
        data.author = auth;
        data.user_id = ObjectId(_id);
        data.sum = 0;
        data.fields = data.fields.map(f => ({name: f.name, votes: 0}));
        dbs.collection('polls').insert(data)
        .catch(err => {
          console.log('DBS INSERT ERROR: ', err);
          io.emit('new-poll-added', {
            error: 'Database connection error'
          });
        })
        .then(res => {
          setTimeout(() => {
            const {author, sum, fields, title, _id} = res.ops[0];
            io.emit('new-poll-added', {author, sum, fields, title, url: _id}
          )}, 1000);
        })
        // socket.broadcast.emit('poll', { poll: 'poll' });
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
          setTimeout(() => io.emit('user_polls', result), 1000);
        });
      })

      socket.on('get-poll', data => {
        if (ObjectId.isValid(data)) {
          dbs.collection('polls').findOne({ _id: ObjectId(data) })
            .catch(err => console.log('GET POLL ERROR', err))
            .then(poll => io.emit('poll', poll))
        }
      })
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
