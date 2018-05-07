const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const URL = process.env.DB_URI

const connect = url => MongoClient.connect(url).then(client => client.db());

module.exports = () => Promise.resolve(connect(URL));