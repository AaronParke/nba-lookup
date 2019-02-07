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

// Route for home. The page never reloads but loads other routes onto the page
router.get('/', function (req, res, next) {
	res.set('Content-Type', 'text/html');
	response = template_reader.getHtml('header');
	response += template_reader.getHtml('search');
	response += template_reader.getHtml('summary');
	response += template_reader.getHtml('footer');
	res.send(response);
});

router.get('/search', function (req, res, next) {
	res.set('Content-Type', 'text/html');
	response = template_reader.getHtml('search');
	res.send(response);
});

// Route for JSON object containing all current players. The front end needs names and ids which are a few layers deep in the object
// This is used by the autocomplete.js on the front end
router.get('/player-names', function (req, res, next) {
	
	res.set('Content-Type', 'application/json');
	response = '';	
	api_options.url = 'https://api.mysportsfeeds.com/v1.0/pull/nba/'+ season +'/cumulative_player_stats.json';
	request(api_options, function(api_error, api_response, api_body) {
		
		if (!api_error && api_response.statusCode == 200) {
			var api_json = JSON.parse(api_body);
			api_json.cumulativeplayerstats.playerstatsentry.push(parke_json.autocomplete);
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
// This is loaded into a .player-container, which can be either one large container if it's the first player searched, 
// or on the left or right if two players are being compared. There are different templates for each
router.get(['/player/:player_id', '/player/:player_id/:side'], function (req, res, next) {

	res.set('Content-Type', 'text/html');
	response = '';
	
	if(req.params.player_id == "parke") {
		if(req.params.side == 'left') {
			response += template_reader.getHtml('player-left', parke_json);
		} else if(req.params.side == 'right') {
			response += template_reader.getHtml('player-right', parke_json);
		} else {
			response += template_reader.getHtml('player', parke_json);
		}
		res.send(response);
	}
	else {
		api_options.url = 'https://api.mysportsfeeds.com/v1.0/pull/nba/'+ season +'/cumulative_player_stats.json?player=' + req.params.player_id;
	
		request(api_options, function(api_error, api_response, api_body) {

			if (!api_error && api_response.statusCode == 200) {
				var api_json = JSON.parse(api_body);
				// Make sure there's data. MySportsFeed will return an object even if the link is invalid
				var contains_player_data = resolve('cumulativeplayerstats.playerstatsentry', api_json);

				if(contains_player_data) {
					if(req.params.side == 'left') {
						response += template_reader.getHtml('player-left', api_json);
					} else if(req.params.side == 'right') {
						response += template_reader.getHtml('player-right', api_json);
					} else {
						response += template_reader.getHtml('player', api_json);
					}
				} else {
					if(req.params.side == 'left' || req.params.side == 'right') {
						response += template_reader.getHtml('error-side');
					} else {
						response += template_reader.getHtml('error');
					}
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
	}	
});

module.exports = router;