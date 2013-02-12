/*
 * Win8Fix.js		MIT License, Copyright 2013, Jason Robitaille www.canuckcoding.ca
 *
 * A fix for IE10, which sets the value of window.devicePixelRatio
 * Due to the nature of IE10 changing zoom level, so long as the viewport is set to device-width,
 * the devicePixelRatio can be recalculated as a ratio of the screen width and document width on
 * the orientationchange event. Due to a "bug" in IE10, the screen width and height values don't
 * swap during device orientation changes so additional portrait/landscape check is needed in the
 * calculations.
 */

if(enyo.platform.ie>=10 && !window.devicePixelRatio) {
	var refreshPixelRatio = function() {
		window.devicePixelRatio = ((window.matchMedia("(orientation: portrait)").matches ? screen.width : screen.height)/document.documentElement.clientWidth);
	};
	document.addEventListener("orientationchange", refreshPixelRatio, false);
	refreshPixelRatio();
}
