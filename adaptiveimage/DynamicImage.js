enyo.kind({
	name: "enyo.DynamicImage",  // While convenient, do note that DynamicImage does not support
				    // the polyfill for window.devicePixelRatio contained within AdaptiveImage
	kind: "enyo.AdaptiveImage",
	// @protected
	handlers: {
		onerror: "ratioFallback"
	},
	autoDecideSrc: true,
	create: function() {
		this.baseSrc = this.src;
		this.src = undefined;
		this.inherited(arguments);
		this.setSrcByRatio(enyo.DynamicImage.srcBuilder(this.baseSrc, enyo.AdaptiveImage.maxDetectedRatio), 
				enyo.AdaptiveImage.maxDetectedRatio);
	},
	//override, as we need the exact pixel ratio to build a url
	searchForMaxDetectedRatio: function() {
		if(window.devicePixelRatio) {
			//works for most devices
			enyo.AdaptiveImage.maxDetectedRatio = parseFloat(window.devicePixelRatio);
		} else {
			enyo.AdaptiveImage.maxDetectedRatio = 1;
		}
	},
	ratioFallback: function(inSender, inEvent) {
		if(enyo.AdaptiveImage.maxDetectedRatio!=1) {
			// Fallback to 1.0 pixel ratio if the exact current pixel ratio image is not found
			// In this way, AdaptiveImage is smarter, but DynamicImage is far simpler to use
			enyo.AdaptiveImage.maxDetectedRatio = 1;
			this.setSrcByRatio(this.baseSrc, 1);
			return true;
		}
	},
	statics: {
		// You can override this static function to use your own src format
		// By default will use the image filepath, in one subfolder deeper,
		// named after the pixel ratio. For example "assets/my-pic.jpg" would
		// be built as "assets/2/my-pic.jpg" for non-1.0 pixel ratio devices
		srcBuilder: function(baseSrc, ratio) {
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
