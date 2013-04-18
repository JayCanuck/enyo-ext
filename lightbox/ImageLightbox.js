/**
	A subkind of <a href="#enyo.Lightbox">enyo.Lightbox</a> designed for displaying images.
	
	It will downscale the image if it's too big for the window, however it will not upscale smaller images
	to preserve image quality/presentation.
*/

enyo.kind({
	name: "enyo.ImageLightbox",
	kind: "enyo.Lightbox",
	published: {
		//* Source URI of the image
		src: ""
	},
	//* @protected
	handlers:{
		onload:"imgLoaded"
	},
	create: function() {
		this.inherited(arguments);
		var c = this.$.client.createComponent({
			name:"img",
			kind:"enyo.Image",
			style:"display:block; max-height:100%; max-width:100%;",
			ondown: "down"
		});
		c.render();
	},
	srcChanged: function() {
		if(this.src!=this.$.client.$.img.src) {
			this.$.client.applyStyle("visibility", "hidden");
			this.$.client.$.img.setSrc(this.src);
		}
	},
	updatePosition: function() {
		//note: have to re-add and afterwards remove max styling to fix IE8 compatability
		this.$.client.$.img.applyStyle("max-width", "100%");
		this.$.client.$.img.applyStyle("max-height", "100%");
		this.$.client.$.img.applyStyle("width", null);
		this.$.client.$.img.applyStyle("height", null);
		this.inherited(arguments);
		var b = this.$.client.$.img.getBounds();
		this.$.client.$.img.applyStyle("width", b.width + "px");
		this.$.client.$.img.applyStyle("height", b.height + "px");
		this.$.client.$.img.applyStyle("max-width", null);
		this.$.client.$.img.applyStyle("max-height", null);
		this.inherited(arguments);
	},
	imgLoaded: function(inEvent) {
		this.updatePosition();
		this.updatePosition();
		this.$.client.applyStyle("visibility", "visible");
	},
	down: function(inSender, inEvent) {
		// Fix to prevent image drag in Firefox
		inEvent.preventDefault();
	},
	//* @public
	statics: {
		/**
			Similar to `enyo.Lightbox.hook()`, this function will create a static `enyo.ImageLightbox` and hook it 
			into the <a href="#enyo.Control">enyo.Control</a> API.  The _params_ object will be mixed in,
			allowing you to set properties like _"scrim"_, _"fade"_ and _"fadeTime"_.

			To harness the embedded image lightbox, all you need to do is add a _"lightbox"_ property to any control, 
			containing a string URI for the image to display. Then, when the control is tapped, the lightbox will 
			appear.

			Note: the lightbox will not appear if there is no lightbox property or if the ontap event for the 
			control is returned true (event propagation stopped).
		*/
		hook: function(params) {
			params = params || {};
			var node = document.getElementById("image-lightbox-container");
			if(!node) {
				var node = document.createElement("div");
				node.id = "image-lightbox-container";
				document.body.appendChild(node);
			}
			enyo.lightbox = new enyo.ImageLightbox(params);
			enyo.lightbox.renderInto(node);
			var oldTap = enyo.Control.prototype.tap;
			enyo.Control.prototype.tap = function(inSender, inEvent) {
				if(inSender.lightbox && (typeof inSender.lightbox === 'string')) {
					enyo.lightbox.setSrc(inSender.lightbox);
					enyo.lightbox.show();
					return true;
				}
			}
		}
	}
});
