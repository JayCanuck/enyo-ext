/**
	Contains a polyfill for certain version of IE and WindowsPhone, which sets the value of window.devicePixelRatio.
	Due to the nature of changing zoom level and screen orientation, so long as the viewport is set to 
	device-width, the devicePixelRatio can be calculated at a given time.
	
	In addition, an `onpixelratiochange` signal will be sent whenever the device pixel ratio is updated, which you
	can listen for like:
	
		{kind: Signals, onpixelratiochange: "handlePixelRatioChange"}
	
	`calcPixelRatio()` when invoked, will update window.devicePixelRatio manually if needed. This is
	automatically done when the device orientation changes as well as whenever the window is resized (to check for
	browser zoom level changes).
*/

var
	Signals = require("enyo/Signals"),
	platform = require("enyo/platform"),
	dispatcher = require("enyo/dispatcher");

var calcPixelRatio = function() {
	var ratio = window.devicePixelRatio;
	if(platform.ie) {
		window.devicePixelRatio = window.devicePixelRatio = window.screen.deviceXDPI / window.screen.logicalXDPI;
	} else if(platform.windowsPhone) {
		window.devicePixelRatio = ((window.matchMedia("(orientation: portrait)").matches ? screen.width : screen.height)/document.documentElement.clientWidth);
	}
	if(window.devicePixelRatio != ratio) {
		Signals.send("onpixelratiochange");
	}
};

//* @protected
dispatcher.listen(document, "orientationchange", calcPixelRatio);
dispatcher.listen(document, "MSOrientationChange", calcPixelRatio);
dispatcher.listen(window, "resize", calcPixelRatio);
calcPixelRatio();
