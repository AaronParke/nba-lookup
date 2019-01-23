// Images courtesy of https://nba-players.herokuapp.com. Images are from the previous season so not all players will have an image

// The containerObject passed in should be a jQuery object of a .player-container - must be passed in success function of .load
function getPlayerPhoto(containerObject) {
	console.log('getPlayerPhoto run');
	var playerContainers = $('.player-container');
	//for(container in playerContainers) {
	var imgTag = $(containerObject.find(".player-photo")),
		imgRegex = /[^a-zA-Z0-9 ]/g,
		playerFirstName = cleanName($(containerObject.find(".player-first-name")).text()),
		playerLastName = cleanName(containerObject.find(".player-last-name").text()),
		imgUrl;

	// Formatting for the img api - alphanumeric and replace spaces with underscores
	function cleanName(name) {
		return name.replace(imgRegex, "").replace(" ", "_");
		
	}

	if(playerFirstName != undefined && playerLastName != undefined) {
		imgTag.attr("src", "https://nba-players.herokuapp.com/players/" + playerLastName + "/" + playerFirstName);
		imgTag.removeClass("generic");
	}
	//}
}