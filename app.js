// Require modules
const express = require('express');
const app = express();
const router = require('./router');

// Setting up static directory - place all front-end resources in this folder
app.use(express.static('public'));

// Send all routes to the router.js file
app.use('/', router);

// Server listens on the port
app.listen(3000, function() {
  console.log('App listening on port 3000');
});