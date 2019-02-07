// Require modules
const express = require('express');
const app = express();
const router = require('./router');
const path = require('path');

// Setting up static directory - place all front-end resources in this folder
app.use('*/css',express.static(path.join(__dirname, 'public/css')));
app.use('*/front_js',express.static(path.join(__dirname, 'public/front_js')));
app.use('*/img',express.static(path.join(__dirname, 'public/img')));

// Send all routes to the router.js file
app.use('/nbalookup', router);

// Server listens on the port
app.listen(3000, function() {
  console.log('App listening on port 3000');
});