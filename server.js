require('source-map-support').install();
process.on('unhandledRejection', console.log('PROMISE ERROR'));

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const initializeDatabases = require('./dbs');

const io = require('./sockets').init(server);
const appRoutes = require('./routes');

const port = process.env.PORT;

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

// app.use((req, res) => res.render('index'));
app.use((req, res) => res.sendFile(__dirname, 'index.html'));

// app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/dist/index.html')));
app.use(appRoutes);

// Start the app by listening on the default Heroku port
server.listen(port, () => console.log(`Server is up on port ${port}`));