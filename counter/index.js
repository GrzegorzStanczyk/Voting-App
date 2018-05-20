module.exports = (counter, dbs) => {
  return Promise.resolve(dbs.collection('counters').findAndModify(
    { 'counter': counter },
    [],
    { $inc: { seq: 1 } },
    { new: true}))
}