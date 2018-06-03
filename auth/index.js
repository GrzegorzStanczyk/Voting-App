const validator = require('validator');
const jwt = require('jsonwebtoken');
console.log('validator.isEmail: ', validator.isEmail('grzegorz@o2.pl'));

var token = jwt.sign(data, 'secret');

// TODO
// Coremodule - spiner, navigacja, comonmodule