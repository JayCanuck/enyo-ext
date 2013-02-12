enyo.kind({
	name: "enyo.DynamicImage",
	kind: "enyo.Image",
	autoSize: true, // will automatically apply width/height; if false, you'll need to set your own width/height
	// @protected
	handlers: {
		onerror: "ratioFallback"
	},
	create: function() {
		this.inherited(arguments);
		
	},
	srcChanged: function() {
		if(this.inFallback) {
			this.inFallback = false;
		} else {
			this.baseSrc = this.src;
			this.ratio = window.devicePixelRatio || 1;
			this.src = enyo.DynamicImage.srcBuilder(this.baseSrc, this.ratio);
		}
		var args = arguments;
		if(this.autoSize) {
			this.determineImageSize(this.src, enyo.bind(this, function(response) {
				var currRatio = this.getCurrentRatio();
				this.applyStyle("width", (response.width/currRatio) + "px");
				this.applyStyle("height", (response.height/currRatio) + "px");
				this.inherited(args);
			}));
		} else {
			this.inherited(args);
		}
		
	},
	reflow: function() {
		this.inherited(arguments);
		if(enyo.platform.ie>=10 && this.ratio!=window.devicePixelRatio) {
			this.searchForMaxDetectedRatio();
			this.determineSrc();
		}
	},
	determineImageSize: function(src, callback) {
		var img = new Image();
		img.onload = function(inEvent) {
			callback({width:img.width, height:img.height});
		};
		img.onerror = enyo.bind(this, function(inError) {
			this.bubble("onerror", inError);
		});
		img.src = src;
	},
	ratioFallback: function(inSender, inEvent) {
		if(this.src!=this.baseSrc) {
			// Fallback to base image src if the exact current pixel ratio image is not found
			// In this way, AdaptiveImage is smarter, but DynamicImage is far simpler to use
			this.inFallback = true;
			this.ratio = 1;
			this.setSrc(this.baseSrc);
			return true;
		}
	},
	getCurrentRatio: function() {
		return this.ratio;
	},
	statics: {
		// You can override this static function to use your own src format
		// By default will use the image filepath, in one subfolder deeper,
		// named after the pixel ratio. For example "assets/my-pic.jpg" would
		// be built as "assets/2/my-pic.jpg" for non-1.0 pixel ratio devices
		srcBuilder: function(baseSrc, ratio) {
			if(!baseSrc) {
				return undefined;
			}
			if(ratio==1) {
				return baseSrc;
			} else {
				var prefix = baseSrc.substring(0, baseSrc.lastIndexOf('/')+1);
				var suffix = baseSrc.substring(baseSrc.lastIndexOf('/')+1);
				return prefix + ratio + "/" + suffix;
			}
		}
	}
});
