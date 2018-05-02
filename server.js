
//Install express server
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const initializeDatabases = require('./dbs');

const appRoutes = require('./routes');

const port = process.env.PORT;

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.use(appRoutes);

// Start the app by listening on the default Heroku port
app.listen(port, () => console.log(`Server is up on port ${port}`));