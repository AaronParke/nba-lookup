var playersLoaded = 0,
		compareButtonHtml = '<a class="btn btn-info" id="compare-button">Compare player</a>',
		switchButtonHtml = '<a class="btn btn-info switch-player">Switch player</a>';

// Initialize .player-container/search input class - should only be full width on the first search
$(".player-container").toggleClass("col-sm-6 col-sm-12");

// Reset when a new search is started, including playersOnScreen = 0. Actually may not be necessary if the page just reloads

// playerContainer should be passed from the autocomplete click - it should contain a div with class... player-container
function loadPlayer(playerContainer, playerLink) {
	$(playerContainer).load(playerLink, function() {
		getPlayerPhoto($(this));
		playersLoaded++;
		if(playersLoaded == 1) {
			// Only on first player load, swap the Switch button for a Compare button
			$(".switch-player").after(compareButtonHtml).remove();
			// The second player should also be loaded with a .switch-player button
			// Function to bold the player with the better number in each category?
		}
		console.log("loadPlayer fired");
		
	});
}

// Add a click handler for #compare-button.
$(document).on("click", "#compare-button", function() {
	console.log("compare-button click fired");
	// This should call a function to move the player info to the left
	var parentContainer = $(this).closest(".player-container");
  parentContainer.toggleClass("col-sm-6 text-right col-sm-12 text-center");
  $(this).closest(".player-stats").toggleClass("player-stats text-left player-stats-left");
  //switch the compare button for a .switch-player button
  $(this).after(switchButtonHtml);
  $(this).remove();

  //add a search
  $.get("./search", function(data) {
  	parentContainer.after(data);
  	addAutocomplete();
  });
});

// Add listener to .switch-player buttons to replace player with search
$(document).on("click", ".switch-player", function() {
	console.log("switch-player click fired");
	var parentContainer = $(this).closest(".player-container");
	$.get("./search", function(data) {
  	parentContainer = parentContainer.replaceWith(data);
  	addAutocomplete();
  	parentContainer.toggleClass("col-sm-12 col-sm-6");
  	console.log(parentContainer);
  });
});

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