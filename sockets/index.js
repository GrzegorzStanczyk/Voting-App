const sio = require('socket.io');
const ObjectId = require('mongodb').ObjectID;
const getNextSequence = require('../counter');
const connectToPoll = require('./connect-to-poll.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

let io = null;
const auth = 'Grzegorz';
const _id = '5af9f1ea790b260380da5e0e'

exports.io = () => io;

exports.init = (server, dbs) => {
  io = sio(server);

  io.on('connection', socket => {
    console.log('SOCKET CONNECTED');

    var address = socket.handshake.address;
    console.log('address: ', address);

    var address2 = socket.request.connection.remoteAddress;
    console.log('address2: ', address2);

    var address4 = socket.request.client._peername.address;
    console.log('address4: ', address4);

    socket.on('add-new-poll', data => {
      data.author = auth;
      data.user_id = ObjectId(_id);
      data.fields = data.fields.map(f => ({name: f.name, votes: 0}));
      data.usersVotedIP = [];
      dbs.collection('polls').insert(data)
      .catch(err => {
        console.log('DBS INSERT ERROR: ', err);
        socket.emit('new-poll-added', {
          error: 'Database connection error'
        });
      })
      .then(res => {
          const { fields, _id } = res.ops[0];
          fields.forEach((p, i) => {
            dbs.collection('counters').insert({ counter: `${_id}${i}`, seq: 0 })
            .catch(err => console.log('COUNTERS INSERT ERROR: ', err))
            .then(() => console.log(`ADDED COUNTER: ${_id}${i}`))
          })
          socket.emit('new-poll-added', _id);
          socket.emit('message', 'Well done! You successful added new poll');
          console.log('NEW POLL ADDED');
      })
    });
  
    socket.on('add-new-user', data => {
      if (!validator.isEmail(data.email)) {
        console.log('INVALID SIGN UP EMAIL');
        return socket.emit('message', 'Invalid email');
      }
      if (!validator.isLength(data.password, 4)) {
        console.log('INVALID SIGN UP PASSWORD LENGTH');
        return socket.emit('message', 'Invalid password length');
      }
      dbs.collection('users').findOne({ email: data.email }, (err, result) => {
        if (err) {
          console.log('DBS FIND NEW USER ERROR: ', err);
          return socket.emit('message', 'Database error');
        }
        if (!result) {
          dbs.collection('users').insert({ name: data.name, email: data.email, password: bcrypt.hashSync(data.password, 10) })
          .catch(err => {
            console.log('DBS ADD NEW USER ERROR: ', err);
            return socket.emit('message', 'Database add user error');
          })
          .then(res => socket.emit('new-user-added'), console.log('NEW USER ADDED'));
        } else {
          console.log('USER EXIST IN DATABASE');
          return socket.emit('message', 'User exist in our database');
        }
      })
    });

    socket.on('sign-in-user', data => {
      dbs.collection('users').findOne({ email: data.email }, (err, result) => {
        if (err) {
          console.log('DBS LOGIN ERROR: ', err);
          return socket.emit('message', 'Database error');
        }
        if (!result) {
          console.log('USER DONT EXIST IN DATABASE');
          return socket.emit('message', 'Invalid login credentials');
        }
        const { name, email, _id, password} = result;
        if (!bcrypt.compareSync(data.password, password)) {
          console.log('USER INSERT INCORRECT PASSWORD');
          return socket.emit('message', 'Invalid login credentials');
        }
        const token = jwt.sign({user: { name, email, _id}}, process.env.SECRET);
        console.log('USER SIGN IN SUCCESS');
        socket.emit('user-login-success', {name, email, token, _id });
      })
    })

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
        if (!result) {
          console.log('NO POLLS IN DATABASE');
          return socket.emit('message', 'You don`t have any polls stored');
        }
        socket.emit('user_polls', result);
        result.user_polls.forEach(r => connectToPoll(r._id, dbs, socket));
      });
    })

    socket.on('connect to poll', room => {
      connectToPoll(room, dbs, socket);
    });

    socket.on('vote', payload => {
      console.log('USER VOTE: ', payload);
      const { _id } = payload.poll
      getNextSequence(`${_id}${payload.index}`, dbs)
      .then(votes => {
        dbs.collection('polls').findAndModify(
          // { _id: ObjectId(_id), usersVotedIP: { $ne: address2 } },
          { _id: ObjectId(_id) },
          [],
          { 
            $set: { ["fields." + payload.index + ".votes"]: votes.value.seq }, 
            $push: { usersVotedIP: address2 } },
          { new: true },
          (err, doc) => {
            if (err) { console.log('FIND AND MODIFY ERROR: ', err); }
            else {
              console.log('FIND AND MODIFY SUCCESS: ', doc.value);
              if (!doc.value) {
                return socket.emit('message', 'You already voted');
              }
              io.to(_id).emit('new vote', doc.value);
            }
          }
        )
      })
    });

    socket.on('delete poll', poll => {
      const { _id } = poll;
      dbs.collection('polls').deleteOne({ _id: ObjectId(_id) }, (err, doc) => {
        if (err) { 
          console.log('DELETE FIELD ERROR: ', err); 
          return socket.emit('message', 'Deleting poll error');
        } else {
          console.log('FIELD DELETE SUCCESS: ');
          socket.emit('delete poll success')
          const reg = new RegExp(_id)
          dbs.collection('counters').deleteMany({ counter: reg }, (err, doc) => {
            if (err) console.log('COUNTERS DELETE ERROR', err)
            else console.log('COUNTERS DELETE SUCCESS')
          });
        }
      });
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
