var fs = require("fs");

// This function is from user speigg on Stack Overflow
// https://stackoverflow.com/a/22129960/5577482
// Because of this, the arrays in the data are referenced with . instead of []
function resolve(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
    return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

function populateValues(content, data_object) {
	// Find all {}, which indicate values to replace, and add the values from the object
	var tag_open = content.indexOf('{'),
	tag_close = content.indexOf('}');

	if (tag_open > -1 && tag_close > -1) {
		// Get the name of the property to replace with a value. Most are nested which is why resolve() is used
		var property_name = content.slice((tag_open + 1), tag_close);
		content = content.replace('{' + property_name.toString() + '}', resolve(property_name, data_object));
		
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