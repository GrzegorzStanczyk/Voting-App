const sio = require('socket.io');
const ObjectId = require('mongodb').ObjectID;
const getNextSequence = require('../counter');

let io = null;

const auth = 'Grzegorz';
const _id = '5af9f1ea790b260380da5e0e'

exports.io = () => io;

exports.init = (server, dbs) => {
  io = sio(server);

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
          const { fields, _id } = res.ops[0];
          socket.emit('new-poll-added', _id);
          fields.forEach((p, i) => {
            dbs.collection('counters').insert({ counter: `${_id}${i}`, seq: 0 })
            .catch(err => console.log('COUNTERS INSERT ERROR: ', err))
            .then(() => console.log(`ADDED COUNTER: ${_id}${i}`))
          })
          console.log('NEW POLL ADDED');
      })
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

    socket.on('connect to poll', room => {
      if (ObjectId.isValid(room)) {
        dbs.collection('polls').findOne({ _id: ObjectId(room) })
          .catch(err => console.log('GET POLL ERROR', err))
          .then(poll => {
            if (!poll) {
              console.log('POLL NOT EXIST');
              return socket.emit('poll not exist', 'Poll not exist in database');
            }
            console.log('JOINED ROOM : ', poll._id);
            socket.join(room);
            socket.emit('connected to poll', poll)
          })
      } else {
        console.log('POLL NOT EXIST');
        return socket.emit('poll not exist', 'Poll not exist in database');
      }
    });

    socket.on('vote', payload => {
      console.log('USER VOTE: ', payload);
      const { _id } = payload.poll
      getNextSequence(`${_id}${payload.index}`, dbs)
      .then(votes => {
        dbs.collection('polls').findAndModify(
          { _id: ObjectId(_id) },
          [],
          { $set: { ["fields." + payload.index + ".votes"]: votes.value.seq } },
          { new: true },
          (err, doc) => {
            if (err) { console.log('FIND AND MODIFY ERROR: ', err); }
            else {
              console.log('FIND AND MODIFY SUCCESS: ', doc.value);
              io.to(_id).emit('new vote', doc.value);
            }
          }
        )
      })
    })
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
