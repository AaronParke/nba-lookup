const router = require('express').Router();
const template_reader = require('./template-reader.js');
const request = require('request');
const resolve = require('./resolve.js');
const parke_json = require('./parke-json.js');

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


// Route for /, which starts with one search bar
router.get('/', function (req, res, next) {
	res.set('Content-Type', 'text/html');
	response = header_html;
	response += template_reader.getHtml('search');
	response += template_reader.getHtml('summary');
	response += footer_html;
	res.send(response);
});

router.get('/search', function (req, res, next) {
	res.set('Content-Type', 'text/html');
	response = template_reader.getHtml('search');
	res.send(response);
});

// Route for JSON containing list of all player names and their id for link to their player pages
// This is used by the autocomplete.js on the front end
router.get('/player-names', function (req, res, next) {
	
	res.set('Content-Type', 'application/json');
	response = '';	
	api_options.url = 'https://api.mysportsfeeds.com/v1.0/pull/nba/'+ season +'/cumulative_player_stats.json';
	request(api_options, function(api_error, api_response, api_body) {
		var api_json = JSON.parse(api_body);

		api_json.cumulativeplayerstats.playerstatsentry.push(parke_json.autocomplete);

		if (!api_error && api_response.statusCode == 200) {
			var all_players = JSON.stringify(resolve('cumulativeplayerstats.playerstatsentry', api_json));
			response += all_players;
		} 

		else {
			if(api_response.statusCode) {
				console.log(api_response.statusCode);
			}
			if(api_error) {
				console.log(api_error);
			}
			// If data wasn't received, return with error message so autocomplete list isn't just blank
			response += JSON.stringify([{"error": {"message": "Unable to load players at this time"}}]);
		}
		res.send(response);
	});
});

// Route for individual player HTML. Returns current season stats for one player based on the id passed as a param.
// This is loaded by a front-end function, should already have header and footer on the page
router.get(['/player/:player_id', '/player/:player_id/:side'], function (req, res, next) {

	res.set('Content-Type', 'text/html');
	response = '';
	
	api_options.url = 'https://api.mysportsfeeds.com/v1.0/pull/nba/'+ season +'/cumulative_player_stats.json?player=' + req.params.player_id;
	
	request(api_options, function(api_error, api_response, api_body) {
		var api_json = JSON.parse(api_body);
		// Make sure there is data. MySportsFeed will return an object even if the link is invalid
		var contains_player_data = resolve('cumulativeplayerstats.playerstatsentry', api_json) || false;

		if (!api_error && api_response.statusCode == 200 && contains_player_data) {
			if(req.params.side == 'left') {
				response += template_reader.getHtml('player-left', api_json);
			} else if(req.params.side == 'right') {
				response += template_reader.getHtml('player-right', api_json);
			} else {
				response += template_reader.getHtml('player', api_json);
			}
		} 

		else if(req.params.player_id == "parke") {
			if(req.params.side == 'left') {
				response += template_reader.getHtml('player-left', parke_json);
			} else if(req.params.side == 'right') {
				response += template_reader.getHtml('player-right', parke_json);
			} else {
				response += template_reader.getHtml('player', parke_json);
			}
		}

		else {
			if(api_response.statusCode) {
				console.log(api_response.statusCode);
			}
			if(api_error) {
				console.log(api_error);
			}
			if(req.params.side == 'left' || req.params.side == 'right') {
				response += template_reader.getHtml('error-side');
			} else {
				response += template_reader.getHtml('error');
			}
		}

		// res.send() needs to be in the request callback so the page will wait on the data
		res.send(response);
	});
});

module.exports = router;