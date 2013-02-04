enyo.kind({
	name: "enyo.Fader",
	events: {
		onFaded:""
	},
	published: {
		opacity:1
	},
	handlers: {
		ontransitionend: "transitionComplete",
		onwebkitTransitionEnd: "transitionComplete"
	},
	minOpacity: 0,
	maxOpacity: 1,
	defaultFadeLength: 500,
	create: function() {
		this.inherited(arguments);
		this.useFallback = ((enyo.platform.ie && enyo.platform.ie<10) || window.opera);
		this.opacityChanged();
	},
	opacityChanged: function() {
		this.opacity = Math.max(Math.min(this.opacity, this.maxOpacity), this.minOpacity);
		this.applyStyle("opacity", this.opacity);
		this.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (this.opacity*100) + ")");
		this.applyStyle("filter", "alpha(opacity=" + (this.opacity*100) + ")");
	},
	fadeIn: function(length) {
		this.fadeTo(this.maxOpacity, length);
	},
	fadeOut: function(length) {
		this.fadeTo(this.minOpacity, length);
	},
	fadeToggle: function(length) {
		if(this.opacity >= (this.maxOpacity/2)) {
			this.fadeOut(length);
		} else {
			this.fadeIn(length);
		}
	},
	fadeTo: function(opacity, length) {
		opacity = Math.max(Math.min(opacity, this.maxOpacity), this.minOpacity);
		if(opacity == this.opacity) {
			return;
		}
		length = length || this.defaultFadeLength;
		if(this.useFallback) {
			var stepLength = 20; //modify this to tune fade smoothing on IE8/IE9/Opera
			var numSteps = length/stepLength;
			var step = (opacity - this.opacity) / numSteps;
			var decreasing = (step < 0)
			var self = this;
			if(this.fadeJob) {
				clearInterval(this.fadeJob);
			}
			this.fadeJob = setInterval(function() {
				if((decreasing && self.opacity > opacity) || (!decreasing && self.opacity < opacity)) {
					self.setOpacity(self.opacity + step);
				} else {
					clearInterval(self.fadeJob);
					self.fadeJob = undefined;
					self.setOpacity(opacity);
					self.doFaded({opacity:self.opacity});
				}
			}, stepLength);
		} else {
			this.applyStyle(enyo.dom.transition, "opacity " + (length/1000) + "s ease-in-out");
			//re-apply current opacity so the transition will apply to changes from this state
			this.setOpacity(this.opacity);
			this.setOpacity(opacity);
		}
	},
	transitionComplete: function(inSender, inEvent) {
		this.applyStyle(enyo.dom.transition, null);
		this.doFaded({
			opacity: this.opacity,
			fadedIn: (this.opacity==this.maxOpacity),
			fadedOut: (this.opacity==this.minOpacity)
		});
		return true;
	}
});
