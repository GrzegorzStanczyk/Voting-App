const ObjectId = require('mongodb').ObjectID;

module.exports = (room, dbs, socket) => {
  if (ObjectId.isValid(room)) {
    dbs.collection('polls').findOne({ _id: ObjectId(room) })
      .catch(err => console.log('GET POLL ERROR', err))
      .then(poll => {
        if (!poll) {
          console.log('POLL NOT EXIST');
          return socket.emit('message', 'Poll not exist in database');
        }
        console.log('JOINED ROOM : ', poll._id);
        socket.join(room);
        socket.emit('connected to poll', poll)
      })
  } else {
    console.log('POLL NOT EXIST');
    return socket.emit('message', 'Poll not exist in database');
  }
}