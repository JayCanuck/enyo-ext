/**
	Contains a polyfill for certain version of IE and WindowsPhone, which sets the value of window.devicePixelRatio.
	Due to the nature of changing zoom level and screen orientation, so long as the viewport is set to 
	device-width, the devicePixelRatio can be calculated at a given time.
	
	In addition, an _"onpixelratiochange"_ signal will be sent whenever the device pixel ratio is updated, which you
	can listen for like:
	
		{kind: "enyo.Signals", onpixelratiochange: "handlePixelRatioChange"}
 */

//* @public
/**
 * When invoked, it will update window.devicePixelRatio manually if needed. This is automatically
 * called when the device orientation changes as well as whenever the window is resized (to check for
 * browser zoom level changes).
 */
enyo.dom.calcPixelRatio = function() {
	var ratio = window.devicePixelRatio;
	if(enyo.platform.ie) {
		window.devicePixelRatio = window.devicePixelRatio = window.screen.deviceXDPI / window.screen.logicalXDPI;
	} else if(enyo.platform.windowsPhone) {
		window.devicePixelRatio = ((window.matchMedia("(orientation: portrait)").matches ? screen.width : screen.height)/document.documentElement.clientWidth);
	}
	if(window.devicePixelRatio != ratio) {
		enyo.Signals.send("onpixelratiochange");
	}
};

//* @protected
enyo.dispatcher.listen(document, "orientationchange", enyo.dom.calcPixelRatio);
enyo.dispatcher.listen(document, "MSOrientationChange", enyo.dom.calcPixelRatio);
enyo.dispatcher.listen(window, "resize", enyo.dom.calcPixelRatio);
enyo.dom.calcPixelRatio();
