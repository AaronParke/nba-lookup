// playerContainer should be passed from the autocomplete click - it should contain a div with class... player-container
function loadPlayer(playerContainer, playerLink) {
	$(playerContainer).load(playerLink, function() {
		getPlayerPhoto($(this));
	});
}