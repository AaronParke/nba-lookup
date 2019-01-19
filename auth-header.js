// Get environment variables
require('dotenv').config();

// Using v 1.0 of the MySportsFeed API

function getAuthHeader() {
	var key = process.env.API_KEY,
	pass = process.env.API_PASS
	// Base 64 encode as required by MySportsFeed
	encrypted_creds = Buffer.from(key + ':' + pass).toString('base64');

	return {'Authorization': 'Basic ' + encrypted_creds};
}

module.exports.authHeader = getAuthHeader();