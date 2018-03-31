enyo.media = {
	HTML5Events: [
		"abort",
		"canplay",
		"canplaythrough",
		"durationchange",
		"emptied",
		"ended",
		"error",
		"loadeddata",
		"loadedmetadata",
		"loadstart",
		"pause",
		"play",
		"playing",
		"progress",
		"ratechange",
		"seeked",
		"seeking",
		"stalled",
		"suspend",
		"timeupdate",
		"volumechange",
		"waiting"
	],
	audioTypes: {
		"mp3":"audio/mpeg",
		"ogg":"audio/ogg",
		"oga":"audio/ogg",
		"wav":"audio/wav",
		"webm":"audio/webm"
	},
	videoTypes: {
		"mp4":"video/mp4",
		"m4v":"video/x-m4v",
		"ogg":"video/ogg",
		"ogv":"video/ogg",
		"webm":"video/webm"
	},
	getParentMedia: function(c) {
		while(c) {
			if(c.isMedia) {
				return c;
			}
			c = c.parent;
		}
	}
};

/*
	Polyfill for current stable version of Enyo, as the below functions are currently
	only in the nightly build.
*/

if(!enyo.dispatcher.stopListening) {
	enyo.dispatcher.stopListening = function(inListener, inEventName, inHandler) {
		var d = enyo.dispatch;
		if (inListener.addEventListener) {
			enyo.dispatcher.stopListening = function(inListener, inEventName, inHandler) {
				inListener.removeEventListener(inEventName, inHandler || d, false);
			};
		} else {
			enyo.dispatcher.stopListening = function(inListener, inEvent, inHandler) {
				inListener.detachEvent("on" + inEvent, inHandler || d);
			};
		}
		enyo.dispatcher.stopListening(inListener, inEventName, inHandler);
	}
}

if(!enyo.unmakeBubble) {
	(function() {
		var bubbleUp = function() {
			enyo.bubble(arguments[0]);
		};
		enyo.makeBubble = function() {
			var args = Array.prototype.slice.call(arguments, 0),
				control = args.shift();
			if((typeof control === "object") && (typeof control.hasNode === "function")) {
				enyo.forEach(args, function(event) {
					if(this.hasNode()) {
						enyo.dispatcher.listen(this.node, event, bubbleUp);
					}
				}, control);
			}
		};
		enyo.unmakeBubble = function() {
			var args = Array.prototype.slice.call(arguments, 0),
				control = args.shift();
			if((typeof control === "object") && (typeof control.hasNode === "function")) {
				enyo.forEach(args, function(event) {
					if(this.hasNode()) {
						enyo.dispatcher.stopListening(this.node, event, bubbleUp);
					}
				}, control);
			}
		};
	})();
}