const fs = require('fs');
const resolve = require('./resolve.js');

function populateValues(content, data_object) {
	// Find all {}, which indicate values to replace, and add the values from the object
	var tag_open = content.indexOf('{'),
	tag_close = content.indexOf('}');

	if (tag_open > -1 && tag_close > -1) {
		// Get the name of the property to replace with a value. Most are nested which is why resolve() is used
		var property_name = content.slice((tag_open + 1), tag_close),
		property_value = resolve(property_name, data_object) || '',
		mins_per_game_property = 'cumulativeplayerstats.playerstatsentry.0.stats.MinSecondsPerGame.#text';

		// Mins per game is returned in seconds, format to minutes
		if(property_name == mins_per_game_property) {
			property_value = (parseFloat(property_value) / 60).toFixed(1).toString();
		}

		content = content.replace('{' + property_name.toString() + '}', property_value);
		// Run it again for the next property
		return populateValues(content, data_object);
	} 

	else {
		// If all property names have been replaced with values, return the content
		return content;
	}
}

function getHtml(templateName, data_object) {
	// Read from the template file
	var content = fs.readFileSync('./templates/' + templateName + '.html', {encoding: "utf8"});

	// Insert values in to the content if a valid object has been passed in
	if(typeof(data_object) != 'undefined' && typeof(data_object) != 'null') {
		var content = populateValues(content, data_object);
	}

	// Return the HTML content, with values if they've been added
	return content;
}

module.exports.getHtml = getHtml;