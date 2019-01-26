// playerContainer should be passed from the autocomplete click - it should contain a div with class... player-container
function loadPlayer(playerContainer, playerLink) {
	$(playerContainer).load(playerLink, function() {
		getPlayerPhoto($(this));
	});
}

// Images courtesy of https://nba-players.herokuapp.com. Images are from the previous season so not all players will have an image
// The containerObject passed in should be a jQuery object of a .player-container - must be passed in success function of .load
function getPlayerPhoto(containerObject) {
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
		var img = new Image();
		imgUrl = "https://nba-players.herokuapp.com/players/" + playerLastName + "/" + playerFirstName;
		img.src = imgUrl;
		// Check if there's an actual image for the player
		// Players in their first season and some other cases don't have images
		img.onload = function() {
			imgTag.attr("src", imgUrl);
			imgTag.removeClass("generic");
		}
	}
}