enyo.kind({
	name: "enyo.DynamicImage",
	kind: "enyo.Image",
	// @protected
	handlers: {
		onerror: "ratioFallback"
	},
	autoDecideSrc: true,
	create: function() {
		this.baseSrc = this.src;
		this.src = enyo.DynamicImage.srcBuilder(this.baseSrc, window.devicePixelRatio || 1);
		this.inherited(arguments);
	},
	srcChanged: function() {
		if(this.inFallback) {
			this.inFallback = false;
		} else {
			this.baseSrc = this.src;
			this.src = enyo.DynamicImage.srcBuilder(this.baseSrc, window.devicePixelRatio || 1);
		}
		this.inherited(arguments);
		
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
	getCurrentRatio: function() {
		return (this.src!=this.baseSrc && window.devicePixelRatio) ? window.devicePixelRatio : 1;
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
