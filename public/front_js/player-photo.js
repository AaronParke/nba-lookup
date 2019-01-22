// Images courtesy of https://nba-players.herokuapp.com. Images are from the previous season so not all players will have an image
var imgTag = $(".player-photo"),
	imgRegex = /[^a-zA-Z0-9 ]/g,
	playerFirstName = cleanName($(".player-first-name").text()),
	playerLastName = cleanName($(".player-last-name").text()),
	imgUrl;

// Formatting for the img api - alphanumeric and replace spaces with underscores
function cleanName(name) {
	return name.replace(imgRegex, "").replace(" ", "_");
	
}

if(playerFirstName != undefined && playerLastName != undefined) {
	imgTag.attr("src", "https://nba-players.herokuapp.com/players/" + playerLastName + "/" + playerFirstName);
	imgTag.removeClass("generic");
}