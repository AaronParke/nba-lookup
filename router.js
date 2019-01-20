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


// Route for /, which has a search bar to look up stats
router.get('/', function (req, res, next) {
	
	res.set('Content-Type', 'text/html');
	response = header_html;
	//response += template_reader.getHtml('player-list');
	response += template_reader.getHtml('search');
	response += footer_html;
	res.send(response);
});

// Create a route for this, the data can be at a URL
// As the user types in the search bar, query MySportsFeed for the input in players' names
// Might need to parse in the search HTML in the request function to make sure the data is loaded first. also be sure to put next() in this function again

// Players returned from MySportsFeed need to be added to the dropdown list under the search bar
	// Each tile should have a link around it. /player/{player_id}. Name could work too



// Route for /player/{player_id}. Returns current season stats for one player based on the id passed as a param
router.get('/player/:player_id', function (req, res, next) {

	res.set('Content-Type', 'text/html');
	response = header_html;

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
		response += footer_html;
		res.send(response);
	});
});


module.exports = router;