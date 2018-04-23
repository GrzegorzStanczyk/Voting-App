
//Install express server
const express = require('express');
const path = require('path');
const app = express();

const appRoutes = require('./routes');

const port = process.env.PORT || 3000;

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());

app.use('/', appRoutes);

app.use((req, res) => res.render('index'));

// app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/dist/index.html')));

// Start the app by listening on the default Heroku port
app.listen(port, () => console.log(`Server is up on port ${port}`));