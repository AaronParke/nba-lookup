const router = require('express').Router();
const template_reader = require('./template-reader.js');
const request = require('request');

// Use for all requests to MySportsFeed API for authorization
const auth_header = require('./auth-header.js').authHeader;
var api_options = {
	headers: auth_header
},
	season = 'latest';

// To store the full response
var response = '';
// Store re-used HTML to cut down load time
var header_html = template_reader.getHtml('header'),
		footer_html = template_reader.getHtml('footer');

// Set up response, add header HTML to response on any page
router.use('/', function (req, res, next) {

	response = '';
	res.set('Content-Type', 'text/html');
	response += header_html;
	next();
});


// Route for /, which has a search bar to look up stats
router.get('/', function (req, res, next) {
	response += template_reader.getHtml('player-list');
	next();
});

// Clicking suggestion gets /player/{player_id}. Probably no search button, just suggestions?

// As typing in the search bar, suggest players

	// To suggest, will need to return player names

// Route for /player/{player_id}. Returns current season stats for one player based on the id passed as a param
router.get('/player/:player_id', function (req, res, next) {

	api_options.url = 'https://api.mysportsfeeds.com/v1.0/pull/nba/'+ season +'/cumulative_player_stats.json?player=' + req.params.player_id;
	request(api_options, function(api_error, api_response, api_json) {
		
		if (!api_error && api_response.statusCode == 200) {
			response += template_reader.getHtml('player', JSON.parse(api_json));
		} 

		else {
			if(api_response.statusCode) {
				console.log(api_response.statusCode);
			}
			if(api_error) {
				console.log(api_error);
			}
			response += 'It seems there was an error of some sort...';
		}

		// next() needs to be in the request callback so the page will wait on the data
		next();
	});
});

// Add footer HTML to response and send response on any page
router.use('/', function (req, res, next) {
	response += footer_html;
	res.send(response);
});

module.exports = router;