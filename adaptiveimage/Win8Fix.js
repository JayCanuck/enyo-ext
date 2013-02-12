if(enyo.platform.ie>=10 && !window.devicePixelRatio) {
	window.devicePixelRatio = ((window.matchMedia("(orientation: portrait)").matches ? screen.width : screen.height)/document.documentElement.clientWidth);
	document.addEventListener("orientationchange", function() {
		window.devicePixelRatio = ((window.matchMedia("(orientation: portrait)").matches ? screen.width : screen.height)/document.documentElement.clientWidth);
	}, false);
}
