const MongoCLient = require('mongodb').MongoCLient;
require('dotenv').config();

const URL = process.env.DB_URI

const connect = url => MongoCLient.connect(url).then(client => client.db());

module.exports = () => Promise.resolve(connect(URL));