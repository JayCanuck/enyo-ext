/**
	A wrapper component that provides animated fading functionality.
	Works on all browsers that Enyo2 supports and includes a static function,
	enyo.Fader.attachTo() that attaches a fader functionality to a control
	itself.
*/
	

enyo.kind({
	name: "enyo.Fader",
	events: {
		/**
			Event triggered after a fade effect finishes
			
			Event data returned includes "opacity" (number 0-1),
			"fadedIn" a boolean of whether the effect faded in completely,
			and "fadedOut" a boolean of whether the effect faded out completely.
		*/
		}
		onFaded:""
	},
	published: {
		//* Current opacity value
		opacity:1
	},
	//* Minimum opacity level the Fader can fade to
	minOpacity: 0,
	//* Maximum opacity level the Fader can fade to
	maxOpacity: 1,
	//* Default time of a fade (in milliseconds)
	defaultFadeLength: 500,
	//* @protected
	handlers: {
		ontransitionend: "transitionComplete",
		onwebkitTransitionEnd: "transitionComplete"
	},
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
	//* @public
	//* Fades in to the maximum opacity in a given length of time (defaults to defaultFadeLength).
	fadeIn: function(length) {
		this.fadeTo(this.maxOpacity, length);
	},
	//* Fades out to the minimum opacity in a given length of time (defaults to defaultFadeLength).
	fadeOut: function(length) {
		this.fadeTo(this.minOpacity, length);
	},
	/**
		Toggles fading in or out depending if opacity is closer to the minimum
		or maximum values, going to the opposite, in a given length of time
		(defaults to defaultFadeLength).
	*/
	fadeToggle: function(length) {
		if(this.opacity >= (this.maxOpacity/2)) {
			this.fadeOut(length);
		} else {
			this.fadeIn(length);
		}
	},
	//* Fades to a specified opacity value, in a given length of time (defaults to defaultFadeLength).
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
					self.doFaded({
						opacity: self.opacity,
						fadedIn: (self.opacity==self.maxOpacity),
						fadedOut: (self.opacity==self.minOpacity)
					});
				}
			}, stepLength);
		} else {
			this.applyStyle(enyo.dom.transition, "opacity " + (length/1000) + "s ease-in-out");
			//re-apply current opacity so the transition will apply to changes from this state
			this.setOpacity(this.opacity);
			this.setOpacity(opacity);
		}
	},
	//* @protected
	transitionComplete: function(inSender, inEvent) {
		this.applyStyle(enyo.dom.transition, null);
		this.doFaded({
			opacity: this.opacity,
			fadedIn: (this.opacity==this.maxOpacity),
			fadedOut: (this.opacity==this.minOpacity)
		});
		return true;
	},
	//* @public
	statics: {
		/**
			Attaches a fader to any existing contol.
			
			Opacity value is an initial opacity for the control (defaults to 1)
			onFaded is an optional function to be executed when a fade event finishes,
			forwarding the event data as the parameter to the function.
		*/
		attachTo: function(control, opacity, onFaded) {
			opacity = (opacity==undefined) ? 1 : opacity;
			control.fader = new enyo.Fader();
			control.fader.applyStyle = enyo.bind(control, control.applyStyle);
			var renderedFunction = enyo.bind(control, control.rendered);
			control.rendered = function() {
				var node = control.hasNode()
				if(node) {
					enyo.dispatcher.listen(node, "transitionend", enyo.bind(control.fader, control.fader.transitionComplete));
					enyo.dispatcher.listen(node, "webkitTransitionEnd", enyo.bind(control.fader, control.fader.transitionComplete));
				}
				renderedFunction();
			}
			control.fader.doFaded = function(data) {
				if(control.fader.onFaded) {
					control.fader.onFaded(data);
				}
			}
			if(onFaded) {
				control.fader.onFaded = onFaded;
			}
			control.fader.setOpacity(opacity);
		}
	}
});
