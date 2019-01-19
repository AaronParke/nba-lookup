// Get environment variables
require('dotenv').config();

//var renderer = require("./renderer.js");
//var querystring = require("querystring");
var request = require("request");

var commonHeaders = {'Content-Type': 'text/html'};

//authorization header format
// Authorization: Basic {encrypted_api_key_credentials}

// DO NOT push to Git without hiding the key and pass first with a .env file
var season = "latest",
	format = "json",
	key = process.env.API_KEY,
	pass = process.env.API_PASS,
	encrypted_creds = Buffer.from(key + ':' + pass).toString('base64');

var options = {
  url: 'https://api.mysportsfeeds.com/v1.0/pull/nba/'+ season +'/cumulative_player_stats.'+ format,
  headers: {
    'Authorization': 'Basic ' + encrypted_creds
  }
};

function callback(error, response, body) {
	console.log(response.statusCode);
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
}


module.exports.getdata = request(options, callback);