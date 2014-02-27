/**
	AdaptiveImage will determine, or attempt to determine via mediaqueries,
	the pixel ratio and will display the image src closest to the current ratio
	(with an optional _"onSrcProposed"_ event to allow for src overriding).
	
	AdaptiveImage is good if you don't know what pixel ratio will be needed,
	whereas <a href="#enyo.DynamicImage">enyo.DynamicImage</a> is simpler to use though
	only works for exact pixel ratios you've included sources for.
*/

enyo.kind({
	name: "enyo.AdaptiveImage",
	kind: "enyo.Image",
	published: {
		//* JSON with property names as the ratio number and the values as the src urls
		srcset: undefined,
	},
	//* Whether automatically apply width/height; if false, you'll need to set your own width/height
	autoSize: true,
	/*
		If the default proposed src should be the closest match, >= than the device's
		detected pixel ratio, rather than the closest match <= the detected pixel ratio.
		For example, if only a 1.0 and 2.0 image srcset was provided, with upperSrc as true
		and on a 1.5 ratio device, then the 2.0 image src would be used.
	*/
	upperSrc: false,
	//* If true, the _"onSrcProposed"_ event will not occur and the best match will be used
	autoDecideSrc: false,
	events: {
		/**
			Provides image src options; can override the default proposed src by changing
			the `proposedSrc` property of the control during this event
			
			Event data will include the _"closestOptions"_ string array, which is the lower and upper closest
			ratio image URL matches, as well as _"srcset"_, which is the full srcset json
		*/
		onSrcProposed:""
	},
	//* @protected
	create: function() {
		if(this.autoDecideSrc) {
			delete this.events.onSrcProposed;
		}
		this.inherited(arguments);
		this.ratios = [];
		this.srcsetChanged();
	},
	setSrcset:function(inSet) {
		//override setSrcset and have it always calls srcsetChanged
		this.setPropertyValue("srcset", inSet, "srcsetChanged");
	},
	srcsetChanged: function() {
		if(!this.srcset) {
			this.srcset = {};
		}
		for(var ratio in this.srcset) {
			var normalizedRatio = parseFloat(ratio).toString();
			if(normalizedRatio != ratio) {
				this.srcset[normalizedRatio] = this.srcset[ratio].toString();
				delete this.srcset[ratio];
				ratio = normalizedRatio;
			}
			this.ratios.push(parseFloat(ratio));
		}
		this.ratios.sort(function(a,b) { return b - a; });
		this.searchForMaxDetectedRatio();
		this.determineSrc();
	},
	searchForMaxDetectedRatio: function() {
		if(window.devicePixelRatio) {
			//works for most devices
			enyo.AdaptiveImage.maxDetectedRatio = parseFloat(window.devicePixelRatio);
		} else {
			//Fallback for devices that support the media queries but not window.devicePixelRatio
			//mainly this applies to Firefox v16 and earlier, as well as IE7-10
			if(window.matchMedia) {
				var matched = false;
				//go through the ratios of the specified image sources to find the largest
				//supported ratio we can provide a source for
				for(var i=0; i<this.ratios.length; i++) {
					if(enyo.AdaptiveImage.checkedRatios.indexOf(this.ratios[i])<0) {
						if(!matched && this.ratios[i]>enyo.AdaptiveImage.maxDetectedRatio) {
							//not cached, so check as it may increase precision
							if(enyo.AdaptiveImage.canSupportRatio(this.ratios[i])) {
								enyo.AdaptiveImage.maxDetectedRatio = this.ratios[i];
								matched = true;
							}
						}
						enyo.AdaptiveImage.checkedRatios.push(this.ratios[i]);
					}
				}
				if(!matched) {
					enyo.AdaptiveImage.maxDetectedRatio = 1;
				}
			} else {
				//browsers that don't support window.devicePixelRatio nor window.matchMedia are
				//outdated enough that we can assume a devicePixelRatio of 1
				enyo.AdaptiveImage.maxDetectedRatio = 1;
			}
		}
	},
	determineSrc: function() {
		if(this.ratios.length>0) {
			var nearest = [];
			var index = -1;
			var max = enyo.AdaptiveImage.maxDetectedRatio.toString();
			if(this.srcset[max]) {
				nearest.push({ratio:enyo.AdaptiveImage.maxDetectedRatio, src:this.srcset[max]});
				index = this.ratios.indexOf(enyo.AdaptiveImage.maxDetectedRatio);
			} else {
				for(var i=0; i<this.ratios.length; i++) {
					if(this.ratios[i]<=enyo.AdaptiveImage.maxDetectedRatio) {
						nearest.push({ratio:this.ratios[i], src:this.srcset[this.ratios[i].toString()]});
						index = i;
						break;
					}
				}
				if(index==-1) {
					this.setSrc(undefined);
					return;
				}
			}
			if(this.ratios.length>index+1) {
				nearest.push({ratio:this.ratios[index+1], src:this.srcset[this.ratios[index+1].toString()]});
			}
			//property overridable in the onSrcProposed event phase
			this.proposedSrc = (nearest.length>1 && this.upperSrc) ? nearest[1].src : nearest[0].src;
			if(!this.autoDecideSrc) {
				//give the developer an option to specify a different src from the srcset, and offer recommendations
				this.doSrcProposed({closestOptions:nearest, srcset:this.srcset});
			}
			if(this.autoSize) {
				this.determineImageSize(this.proposedSrc, enyo.bind(this, function(response) {
					var currRatio = this.getRatioBySrc(this.proposedSrc);
					this.applyStyle("width", (response.width/currRatio) + "px");
					this.applyStyle("height", (response.height/currRatio) + "px");
					this.setSrc(this.proposedSrc);
				}));
			} else {
				this.setSrc(this.proposedSrc);
			}
		} else {
			this.setSrc(undefined);
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
	//* @public
	//* Sets an image source URL for a particular device pixel ratio
	setSrcByRatio: function(src, ratio) {
		ratio = parseFloat(ratio);
		this.srcset[ratio.toString()] = src;
		this.ratios.push(ratio);
		this.ratios.sort(function(a,b){return b-a});
		if(ratio == enyo.AdaptiveImage.maxDetectedRatio) {
			this.determineSrc();
		} else if(!window.devicePixelRatio && enyo.AdaptiveImage.checkedRatios.indexOf(ratio)<0) {
			if(window.matchMedia && enyo.AdaptiveImage.canSupportRatio(ratio)
					&& enyo.AdaptiveImage.maxDetectedRatio<ratio) {
				enyo.AdaptiveImage.maxDetectedRatio = ratio;
				this.determineSrc();
			}
			enyo.AdaptiveImage.checkedRatios.push(ratio);
		}
	},
	//* Removes an image source URL entry from the srcset by a given device pixel ratio
	removeSrcByRatio: function(ratio) {
		ratio = parseFloat(ratio);
		var src = this.srcset[ratio.toString()];
		delete this.srcset[ratio.toString()];
		this.ratios.splice(this.ratios.indexOf(ratio), 1);
		if(this.src == src) {
			this.determineSrc();
		}
	},
	//* Returns the currently active image source URL
	getCurrentSrc: function() {
		return this.src;
	},
	//* Returns the image source URL corresponding to a given device pixel ratio
	getSrcByRatio: function(ratio) {
		ratio = parseFloat(ratio);
		return this.srcset[ratio.toString()];
	},
	//* Returns the pixel ratio of the currently active image
	getCurrentRatio: function() {
		return this.getRatioBySrc(this.src);
	},
	//* Returns the pixel ratio of a given image source URL from the srset
	getRatioBySrc: function(src) {
		var result = undefined;
		for(var ratio in this.srcset) {
			if(this.srcset[ratio] == src) {
				result = parseFloat(ratio);
				break;
			}
		}
		return result;
	},
	statics: {
		//* @protected
		//will be determined at runtime
		maxDetectedRatio: 0,
		//cache of ratios compared against; static for effiency in multiple AdaptiveImage usage
		checkedRatios: [],
		//* @public
		/**
			Uses window.matchMedia to check if the browser supports displaying images at a given
			device pixel ratio. Do note that a true result doesn't necessarily mean that the given
			ratio is the ratural/greatest supported device pixel ratio; it just means that is _can_
			support the ratio.
		*/
		canSupportRatio: function(ratio) {
			var queries = [
				"(min-resolution: " + ratio + "dppx)",
				"(min-device-pixel-ratio: " + ratio + ")",
				"(-webkit-min-device-pixel-ratio: " + ratio + ")",
				"(min--moz-device-pixel-ratio: " + ratio + ")",
				"(-ms-min-device-pixel-ratio: " + ratio + ")",
				//Opera requires fraction form
				"(-o-min-device-pixel-ratio: " + Math.toFraction(ratio) + ")"
			];
			var match = false;
			if(window.matchMedia) {
				for(var q=0; q<queries.length; q++) {
					if(window.matchMedia(queries[q]).matches) {
						match = true;
						break;
					}
				}
			}
			return match;
		}
	}
});

/**
	Converts a number to a fraction string
	
	For example, `Math.toFraction(1.5)` returns `"3/2"`
*/
Math.toFraction = function(d) {
    var top = d.toString();
    top = (top.indexOf("\.")>-1) ? top.replace(/\d+[.]/, '') : "0";
    var bot = Math.pow(10, top.length);
    if (d > 1) {
	top = +top + Math.floor(d) * bot;
    }
    var x = function gcd(a, b) {
	return (b) ? gcd(b, a % b) : a;
    }(top, bot);
    return (top / x) + "/" + (bot / x);
};

