enyo.kind({
	name: "enyo.AdaptiveImage",
	kind: "enyo.Image",
	published: {
		srcset: undefined, // json with property names as the ratio number and the values as the src urls
	},
	autoSize: true, // will automatically apply width/height; if false, you'll need to set your own width/height
	upperSrc: false, // If the default proposed src should be the closest match, >= than the device's
			 // detected pixel ratio, rather than the closest match <= the detected pixel ratio
			 // For example, if only a 1.0 and 2.0 image srcset was provided, with upperSrc as true
			 // and on a 1.5 ratio device, then the 2.0 image src would be used
	autoDecideSrc: false, // if true, the "onSrcProposed" event will not occur
	events: {
		onSrcProposed:"" // provides image src options; can override the default proposed src by changing
				 // the "proposedSrc" property during this event
	},
	// @public
	create: function() {
		if(this.autoDecideSrc) {
			delete this.events.onSrcProposed;
		}
		this.inherited(arguments);
		this.ratios = [];
		this.srcsetChanged();
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
			enyo.log("1");
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
						enyo.log("Testing " + this.ratios[i]);
						if(!matched && this.ratios[i]>enyo.AdaptiveImage.maxDetectedRatio) {
							//not cached, so check as it may increase precision
							enyo.log("\t...not cached");
							if(this.mediaQuery(this.ratios[i])) {
								enyo.log("\t...query matched!");
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
	mediaQuery: function(ratio) {
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
		for(var q=0; q<queries.length; q++) {
			if(window.matchMedia(queries[q]).matches) {
				match = true;
				break;
			}
		}
		return match;
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
				if(firstUnder==-1) {
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
	// @public
	setSrcByRatio: function(src, ratio) {
		ratio = parseFloat(ratio);
		this.srcset[ratio.toString()] = src;
		this.ratios.push(ratio);
		this.ratios.sort(function(a,b){return b-a});
		if(ratio == enyo.AdaptiveImage.maxDetectedRatio) {
			this.determineSrc();
		} else if(!window.devicePixelRatio && enyo.AdaptiveImage.checkedRatios.indexOf(ratio)<0) {
			if(window.matchMedia && this.mediaQuery(ratio) && enyo.AdaptiveImage.maxDetectedRatio<ratio) {
				enyo.AdaptiveImage.maxDetectedRatio = ratio;
				this.determineSrc();
			}
			enyo.AdaptiveImage.checkedRatios.push(ratio);
		}
	},
	removeSrcByRatio: function(src, ratio) {
		ratio = parseFloat(ratio);
		this.srcset[ratio.toString()] = undefined;
		this.ratios.splice(this.ratios.indexOf(ratio), 1);
		if(this.src == src) {
			this.determineSrc();
		}
	},
	getSrcByRatio: function(ratio) {
		ratio = parseFloat(ratio);
		return this.srcset[ratio.toString()];
	},
	getCurrentRatio: function() {
		return this.getRatioBySrc(this.src);
	},
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
		//will be determined at runtime
		maxDetectedRatio: 0,
		//cache of ratios compared against; static for effiency in multiple AdaptiveImage usage
		checkedRatios: []
	}
});

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

