/**
	A fix for IE10, which sets the value of window.devicePixelRatio
	Due to the nature of IE10 changing zoom level, so long as the viewport is set to device-width,
	the devicePixelRatio can be recalculated as a ratio of the screen width and document width on
	the orientationchange event.
	
	Sends an _"onpixelratiochange"_ signal that you can listen for like:
	
		{kind: "enyo.Signals", onpixelratiochange: "handlePixelRatioChange"}
*/

if((enyo.platform.ie>=10 || enyo.platform.windowsPhone) && !window.devicePixelRatio) {
	var refreshPixelRatio = function() {
		var prev = window.devicePixelRatio;
		window.devicePixelRatio = ((window.matchMedia("(orientation: portrait)").matches ? screen.width : screen.height)/document.documentElement.clientWidth);
		if(window.devicePixelRatio != prev) {
			enyo.Signals.send("onpixelratiochange");
		}
	};
	enyo.dispatcher.listen(document, "orientationchange", refreshPixelRatio);
	refreshPixelRatio();
}
