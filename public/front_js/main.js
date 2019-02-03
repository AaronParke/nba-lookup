// This is to store which player is loaded first. When the second player search is added, this link is re-loaded in the player-left template, it starts as just player
var firstPlayerLink = '';

// Initialize .player-container/search input class - should only be full width on the first search
$(".player-container").toggleClass("col-xs-6 col-xs-12");

// playerContainer should be passed from the autocomplete click - it should be an object for a div element with class... player-container
// There are 3 player HTML templates - player, player-left, and player-right. player is only used until "Compare player" is clicked
// After that, left or right is loaded depending on which side the search bar that is loading the player was on
function loadPlayer(playerContainer, playerLink) {

	// Check if this is the first or second player-container on the page and store index, since we are replacing the search HTML with the player HTML
	// When the switch is made the reference to the element is lost. With the index the new container element can be retrieved
	var containerIndex = $('.player-container').index(playerContainer),
			parentElement = playerContainer.parent();
	
	var allContainers = $(parentElement).find('.player-container');
	if(allContainers.length == 1) {
		// On the first player load, get the centered version of the template
		$.get(playerLink, function(data) {
			playerContainer.replaceWith(data);
			// Re-calculate allContainers so it has the new element added by replaceWith()
			allContainers = $(parentElement).find('.player-container');
			// Get photo for the .player-container element that replaced the one passed into loadPlayer
			// Photo must be loaded in $.get() callback
			getPlayerPhoto($(allContainers[containerIndex]));
  	});

		// Store this for #compare-player click
		firstPlayerLink = playerLink;
		
	} else if(containerIndex == 0) {
		$.get(playerLink + '/left', function(data) {
			playerContainer.replaceWith(data);
			// Re-calculate allContainers so it has the new element added by replaceWith()
			allContainers = $(parentElement).find('.player-container');
			// Get photo for the .player-container element that replaced the one passed into loadPlayer
			// Photo must be loaded in $.get() callback
			getPlayerPhoto($(allContainers[containerIndex]));
			comparePlayerStats();
			setStatsHeights();
  	});
	} else {
		$.get(playerLink + '/right', function(data) {
			playerContainer.replaceWith(data);
			// Re-calculate allContainers so it has the new element added by replaceWith()
			allContainers = $(parentElement).find('.player-container');
			// Get photo for the .player-container element that replaced the one passed into loadPlayer
			// Photo must be loaded in $.get() callback
			getPlayerPhoto($(allContainers[containerIndex]));
			comparePlayerStats();
			setStatsHeights();
  	});
	}
}

// Add a click handler for #compare-player, which is only on the first player loaded and is removed after another search is added
$(document).on("click", "#compare-player", function() {
	// Switch classes to move the first container to the left
	var parentContainer = $(this).closest(".player-container");

  // Add a search, new container is included in this
  $.get("./search", function(data) {
  	parentContainer.after(data);
  	addAutocomplete();

  	// Load the first player again, but with the left template since there are now two containers
  	loadPlayer(parentContainer, firstPlayerLink);
  });
});

// Add listener to .switch-player buttons to replace player with search
$(document).on("click", ".switch-player", function() {
	var parentContainer = $(this).closest(".player-container");
	$.get("./search", function(data) {
  	parentContainer = parentContainer.replaceWith(data);
  	addAutocomplete();
  	parentContainer.toggleClass("col-sm-12 col-sm-6");
  	removeCompareStats();
  });
});

// Images courtesy of https://nba-players.herokuapp.com. Images are from the previous season so not all players will have an image
// The containerObject passed in should be a jQuery object of a .player-container - must be passed in success function of .load
function getPlayerPhoto(containerObject) {
	var imgTag = $(containerObject.find(".player-photo.generic")),
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
		if(playerFirstName == "Aaron" && playerLastName == "Parke") {
			imgUrl = "img/parke.png"
		}
		else {
			imgUrl = "https://nba-players.herokuapp.com/players/" + playerLastName + "/" + playerFirstName;
		}
		img.src = imgUrl;
		// Check if there's an actual image for the player
		// Players in their first season and some other cases don't have images
		img.onload = function() {
			imgTag.attr("src", imgUrl);
			imgTag.removeClass("generic");
		}
	}
}

// Text styling for two players being compared, highlights better number in each category
function comparePlayerStats() {
	var firstPlayerStats = $(document).find(".player-stats-left").find('.stat-value');
	var secondPlayerStats = $(document).find(".player-stats-right").find('.stat-value');
	// Only proceed if stats are being displayedfor two players
	if(firstPlayerStats.length > 0 && secondPlayerStats.length > 0) {
		for(var i = 0; i < firstPlayerStats.length; i++) {
			if(parseFloat($(firstPlayerStats[i]).text()) > parseFloat($(secondPlayerStats[i]).text())) {
				$(firstPlayerStats[i]).addClass("better-number");
			} else if(parseFloat($(firstPlayerStats[i]).text()) < parseFloat($(secondPlayerStats[i]).text())) {
				$(secondPlayerStats[i]).addClass("better-number");
			}
		}
	}
}

function removeCompareStats() {
	$(document).find(".better-number").each(function() {
		$(this).removeClass("better-number");
	});
}

$(window).resize(function() {
  setStatsHeights();
});

// Setting elements of .player-stats heights equal to each other. 
// They can be different based on how many characters are there so this keeps them aligned
function setStatsHeights() {
	var statsDivs = $(document).find(".player-stats");
  if(statsDivs.length > 1) {
  	var firstStats = $(statsDivs[0]),
  				secondStats = $(statsDivs[1]);
  	if($(statsDivs[0]).height() != $(statsDivs[1]).height()) {
  		for(var element = 0;  element < firstStats.children().length; element++) {
  			if($(firstStats.children()[element]).height() > $(secondStats.children()[element]).height()) {
  				$(secondStats.children()[element]).height($(firstStats.children()[element]).height());
  			} else if($(secondStats.children()[element]).height() > $(firstStats.children()[element]).height()) {
  				$(firstStats.children()[element]).height($(secondStats.children()[element]).height());
  			}
  		}
  	}
  }
}
