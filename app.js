// Require modules
const express = require('express');
const app = express();
const router = require('./router');
const PATH = require('path');

// Setting up static directory - place all front-end resources in this folder
app.use('*/css',express.static('/public/css'));
app.use('*/front_js',express.static('/public/front_js'));
app.use('*/img',express.static('/public/img'));

// Send all routes to the router.js file
app.use('/nba-lookup', router);

// Server listens on the port
app.listen(3000, function() {
  console.log('App listening on port 3000');
});