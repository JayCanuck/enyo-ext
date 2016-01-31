/**
	A lightbox-style popup with a variety of configurable options to customize presentation.
*/

var
	Popup = require("enyo/Popup"),
	IconButton = require("onyx/IconButton"),
	platform = require("enyo/platform"),
	dom = require("enyo/dom"),
	utils = require("enyo/utils"),
	Control = require("enyo/Control");

var staticbox = undefined;

var Lightbox = module.exports = Popup.kind({
	name: "Lightbox",
	/**
		By default, the popup will hide when the user taps outside it or presses ESC.
		Set to false to prevent this behavior.
	*/
	autoDismiss: true,
	/**
		When _true_, a translucent scrim will cover the entire screen behind the popup.
		
		The scrim is black, with a specify opacity applied (specified by the `scrimOpacity` property.
	*/
	scrim: true,
	//* The opacity value for the scrim. Valid values are between 0 and 1 inclusively.
	scrimOpacity: 0.65,
	/**
		When _true_, the popup (and scrim, if `scrim` is true) will fade-in/fade-out when when `show()`
		and `hide` (or `setShowing(booleanValue)`) are called.
	*/
	fade: true,
	//* Time, in milliseconds, to fade-in/fade-out, if the `fade` propert is _true_
	fadeTime: 200,
	events: {
		/**
			Send when the fading action is completed. Event data includes _"opacity"_, as well as
			the boolean properties _"fadedIn"_ and _"fadedOut"_ to indicate the state after the
			fade has completed.
		*/
		onFaded:""
	},
	//* @protected
	modal: true,
	centered: true,
	classes: "enyo-lightbox",
	handlers: {
		ontransitionend: "transitionComplete",
		onwebkitTransitionEnd: "transitionComplete",
		onFaded:"handleFaded"
	},
	components:[
		{name:"scrim", classes:"enyo-lightbox-scrim", ontap:"scrimTap", ondragstart:"scrimDrag"},
		{name:"close", kind:IconButton, classes:"enyo-lightbox-close", ontap:"hide"},
		{name:"client", classes:"enyo-lightbox-client"}
	],
	create: function() {
		this.inherited(arguments);
		this.useFadeFallback = ((platform.ie && platform.ie<10) || window.opera);
		this.$.scrim.setShowing(this.scrim);
		this.setOpacity((this.fade) ? 0 : 1);
		this.$.close.setSrc(Lightbox.closeBtnURI);
	},
	updatePosition: function() {
		var d = this.calcViewportSize();
		this.$.client.applyStyle("width", null);
		this.$.client.applyStyle("height", null);        
		this.inherited(arguments);
		var b = this.getBounds();
		var w = Math.min(d.width, b.width);
		var h = Math.min(d.height, b.height);
		this.$.client.applyStyle("width", w-66 + "px");
		this.$.client.applyStyle("height", h-66 + "px");
	},
	scrimTap:function(inSender, inEvent) {
		if(this.autoDismiss) {
			this.hide();
		}
		return true;
	},
	scrimDrag:function(inSender, inEvent) {
		if(this.autoDismiss) {
			this.hide();
		}
		return true;
	},
	setOpacity: function(opacity) {
		this.opacity = Math.max(Math.min(opacity, 1), 0);
		var scrimOpacity = this.scrimOpacity * this.opacity;
		this.$.scrim.applyStyle("opacity", scrimOpacity);
		this.$.scrim.applyStyle("filter", "alpha(opacity=" + (scrimOpacity*100) + ")");
		this.applyStyle("opacity", this.opacity);
		this.applyStyle("filter", "alpha(opacity=" + (this.opacity*100) + ")");
	},
	setShowing: function(value) {
		if(this.fade) {
			if(value) {
				this.fade = false;
				this.show();
				this.fade = true;
				this.fadeTo(1, length);
			} else {
				this.fadeTo(0, length);
			}
		} else {
			this.inherited(arguments);
			this.$.scrim.setShowing(value);
		}
	},
	fadeTo: function(opacity, length) {
		opacity = Math.max(Math.min(opacity, 1), 0);
		if(opacity == this.opacity) {
			return;
		}
		length = length || this.fadeTime;
		if(this.useFadeFallback) {
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
						fadedIn: (self.opacity==1),
						fadedOut: (self.opacity==0)
					});
				}
			}, stepLength);
		} else {
			this.applyStyle(dom.transition, "opacity " + (length/1000) + "s ease-in-out");
			this.$.scrim.applyStyle(dom.transition, "opacity " + (length/1000) + "s ease-in-out");
			//re-apply current opacity so the transition will apply to changes from this state
			this.setOpacity(this.opacity);
			this.setOpacity(opacity);
		}
	},
	transitionComplete: function(inSender, inEvent) {
		this.$.scrim.applyStyle(dom.transition, null);
		this.applyStyle(dom.transition, null);
		this.doFaded({
			opacity: this.opacity,
			fadedIn: (this.opacity==1),
			fadedOut: (this.opacity==0)
		});
		return true;
	},
	handleFaded: function(inSender, inEvent) {
		if(inEvent.fadedOut) {
			this.fade = false;
			this.hide();
			this.fade = true;
		}
	},
	//* @public
	statics: {
		//* @protected
		/*
			Onyx-Style Cross Icon
			Copyright 2012-2013 Duncan Stevenson
			Licensed under the Apache License, Version 2.0 (the "License");
			you may not use this file except in compliance with the License.
			You may obtain a copy of the License at
			http://www.apache.org/licenses/LICENSE-2.0
			Unless required by applicable law or agreed to in writing, software
			distributed under the License is distributed on an "AS IS" BASIS,
			WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
			See the License for the specific language governing permissions and
			limitations under the License.
		*/
		closeBtnURI: "data:image/png;base64,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",
		//* @public
		/**
			This function will create a static `enyo.Lightbox` and hook into the 
			<a href="#enyo.Control">enyo.Control</a> API.  The _params_ object will be mixed in to the lightbox,
			allowing you to set properties like _"scrim"_, _"fade"_ and _"fadeTime"_.
			
			To harness the embedded lightbox, all you need to do is add a _"lightbox"_ property to any control, 
			containing control(s) you want to be created within lightbox. Then, when the control is tapped,
			the lightbox will appear. Inline events listed within the _"lightbox"_ property will not work, so
			instead used custom kinds with encapsulated event handling.
			
			Note: the lightbox will not appear if there is no lightbox property or if the ontap event for the 
			control is returned true (event propagation stopped).
		*/
		hook: function(params) {
			params = params || {};
			var node = document.getElementById("lightbox-container");
			if(!node) {
				var node = document.createElement("div");
				node.id = "lightbox-container";
				document.body.appendChild(node);
			}
			staticbox = new Lightbox(params);
			staticbox.renderInto(node);
			var f = utils.bind(Control.prototype, Control.prototype.tap);
			Control.prototype.tap = function(inSender, inEvent) {
				if(inSender.lightbox) {
					staticbox.$.client.destroyComponents();
					if(Object.prototype.toString.call(inSender.lightbox) === '[object Array]') {
						staticbox.$.client.createComponents(inSender.lightbox);
					} else if(typeof inSender.lightbox === 'object') {
						staticbox.$.client.createComponent(inSender.lightbox);
					}
					staticbox.$.client.render();
					staticbox.show();
					return true;
				}
			}
		}
	}
});
