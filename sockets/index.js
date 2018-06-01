const sio = require('socket.io');
const ObjectId = require('mongodb').ObjectID;
const getNextSequence = require('../counter');
const connectToPoll = require('./connect-to-poll.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

let io = null;

exports.io = () => io;

exports.init = (server, dbs) => {
  io = sio(server);

  io.on('connection', socket => {
    console.log('SOCKET CONNECTED');

    socket.on('add-new-poll', (data, token) => {
      if (token && token.length > 0) {
        try {
          const { name, _id } = jwt.verify(token, process.env.SECRET).user;
          data.author = name;
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
        } catch (err) {
          console.log('INVALID TOKEN', err);
          return socket.emit('message', 'Invalid login credentials');
        }
      } else if (!token) {
        console.log('USER TRY INVALID ACTION');
        return socket.emit('message', 'To add new poll, first Sign In');
      }
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
      let email;
      if (typeof(data) === 'string' && data.length > 0) {
        try {
          email = jwt.verify(data, process.env.SECRET).user.email;
        } catch (err) {
          console.log('INVALID TOKEN', err);
          return socket.emit('message', 'Invalid login credentials');
        }
      } else if (typeof(data) === 'object') {
        if (!validator.isEmail(data.email)) {
          console.log('INVALID SIGN UP EMAIL');
          return socket.emit('message', 'Invalid email');
        }
        if (!validator.isLength(data.password, 4)) {
          console.log('INVALID SIGN UP PASSWORD LENGTH');
          return socket.emit('message', 'Invalid password length');
        }
        email = data.email;
      }
      dbs.collection('users').findOne({ email }, (err, result) => {
        if (err) {
          console.log('DBS LOGIN ERROR: ', err);
          return socket.emit('message', 'Database error');
        }
        if (!result) {
          console.log('USER DONT EXIST IN DATABASE');
          return socket.emit('message', 'Invalid login credentials');
        }
        const { name, email, _id, password} = result;
        if (!typeof(data === 'string') && !bcrypt.compareSync(data.password, password)) {
          console.log('USER INSERT INCORRECT PASSWORD');
          return socket.emit('message', 'Invalid login credentials');
        }
        const token = jwt.sign({user: { name, email, _id}}, process.env.SECRET);
        console.log('USER SIGN IN SUCCESS');
        socket.emit('user-login-success', {name, email, token, _id });
      })
    })

    socket.on('get_user_polls', token => {
      if (token && token.length > 0) {
        try {
          const _id = jwt.verify(token, process.env.SECRET).user._id;
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
            console.log('USER REQUEST POLLS');
            socket.emit('user_polls', result.user_polls);
            result.user_polls.forEach(r => connectToPoll(r._id, dbs, socket));
          });
        } catch (err) {
          console.log('INVALID TOKEN', err);
          return socket.emit('message', 'Invalid login credentials');
        }
      } else if (!token) {
        console.log('USER TRY INVALID ACTION');
        return socket.emit('message', 'To your polls, first Sign In');
      }
    })

    socket.on('connect to poll', room => {
      connectToPoll(room, dbs, socket);
    });

    socket.on('vote', payload => {
      console.log('USER VOTE: ', payload);
      const { _id } = payload.poll
      getNextSequence(`${_id}${payload.index}`, dbs)
      .then(votes => {
        var address = socket.handshake.address;
        console.log('address: ', address);

        var address2 = socket.request.connection.remoteAddress;
        console.log('address2: ', address2);

        var address4 = socket.request.client._peername.address;
        console.log('address4: ', address4);

        dbs.collection('polls').findAndModify(
          { _id: ObjectId(_id), usersVotedIP: { $ne: address2 } },
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
