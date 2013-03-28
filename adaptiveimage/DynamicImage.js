/**
	DynamicImage on the other hand uses the window.devicePixelRatio value to
	outright build a URL (urlBuilder function is static and can be overriden
	with a custom builder if desired). This is a bit more streamlined than
	AdaptiveImage, however if the built url for the current ratio doesn't exist,
	then it will fallback to the 1.0 base ratio source.
	
	DynamicImage is simple to use, though only works for exact pixel ratios
	you've included sources for, whereas AdaptiveImage is good if you don't
	know what pixel ratio will be needed.
*/

enyo.kind({
	name: "enyo.DynamicImage",
	kind: "enyo.Image",
	//* Whether automatically apply width/height; if false, you'll need to set your own width/height
	autoSize: true,
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
			this.src = enyo.DynamicImage.srcBuilder(this.baseSrc, window.devicePixelRatio || 1);
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
			this.setSrc(this.baseSrc);
			return true;
		}
	},
	//* @public
	//* Returns the currently active image source URL
	getCurrentRatio: function() {
		return (this.src!=this.baseSrc && window.devicePixelRatio) ? window.devicePixelRatio : 1;
	},
	statics: {
		/**
			You can override enyo.DynamicImage.srcBuilder() static function to use your own src format.
			By default will use the image filepath, in one subfolder deeper, named after the pixel
			ratio. For example "assets/my-pic.jpg" would be built as "assets/2/my-pic.jpg" for 2.0
			pixel ratio devices.
		*/
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
