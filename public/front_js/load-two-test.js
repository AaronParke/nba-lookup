$(document).ready( function() {
	var playerContainers = $('.player-container');
	/*for(container in playerContainers) {
		playerContainers[container].load();
	}*/
	$(playerContainers[0]).load('./player/9137', function() {
		getPlayerPhoto($(this));
		$(playerContainers[1]).load('./player/9136', function() {
			getPlayerPhoto($(this));
		});
	});
});